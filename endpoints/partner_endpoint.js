const router = require("express").Router();
const StatusCode = require("../helper/status_code_helper");
const Partner = require("../models/partner_model");
const Patient = require("../models/patient_model");
const Count = require("../models/count_status");
const { param, body, validationResult } = require("express-validator");
const { fileUpload, fileDelete } = require("../helper/file_upload_helper");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//if partner is already exist , we use this endpoint
router.post(
  "/partnerJoin",
  [
    body("patient_id_1")
      .notEmpty()
      .withMessage("ID is required")
      .trim()
      .escape()
      .custom((value) => {
        // Check if the value is an integer
        if (!Number.isInteger(Number(value))) {
          throw new Error("ID must be an integer");
        }
        // Check if the name contains special characters
        const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;
        if (specialCharsRegex.test(value)) {
          throw new Error("Name cannot contain special characters");
        }
        // Return true to indicate validation passed
        return true;
      }),
    body("patient_id_2")
      .notEmpty()
      .withMessage("ID is required")
      .trim()
      .escape()
      .custom((value) => {
        // Check if the value is an integer
        if (!Number.isInteger(Number(value))) {
          throw new Error("ID must be an integer");
        }

        // Check if the name contains special characters
        const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;
        if (specialCharsRegex.test(value)) {
          throw new Error("Name cannot contain special characters");
        }

        // Return true to indicate validation passed
        return true;
      }),
    body().custom((value, { req }) => {
      if (req.body.patient_id_1 === req.body.patient_id_2) {
        throw new Error("Patient IDs must be different");
      }
      return true;
    }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json(new StatusCode.INVALID_ARGUMENT(errors.errors[0].msg));
      }
      const { patient_id_1, patient_id_2 } = req.body;
      console.log({ patient_id_1, patient_id_2 });
      const isExist = await Partner.partnerCheck(patient_id_1, patient_id_2);

      console.log("Is Exist :", isExist);

      if (isExist.data.code == 409) {
        console.log("Already Exit");
        return res.json(new StatusCode.ALREADY_EXISTS());
      }
      const linkPartner = await Partner.partnerCreate(
        patient_id_1,
        patient_id_2
      );
      return res.json(new StatusCode.OK(linkPartner));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

//if we need to create new patient , we use this endpoint .
// And to create new patient , we use createPatient model from Patient model
router.post(
  "/partnerCreateWithPic",
  upload.single("image"),
  [
    body("name")
      .notEmpty()
      .withMessage("Name is required")
      .trim()
      .escape()
      .custom((value) => {
        // Check if the name contains special characters
        const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;
        if (specialCharsRegex.test(value)) {
          throw new Error("Name cannot contain special characters");
        }
        // Return true to indicate validation passed
        return true;
      }),
    body("dob")
      .notEmpty()
      .matches(/^\d{4}\/\d{2}\/\d{2}$/) // Matches format yyyy/mm/dd
      .withMessage("Date of birth must be in yyyy/mm/dd format"),
    body("nrc").custom((value) => {
      if (value == "null" || value == "") {
        return true;
      }
      if (value && !/^\d{1,2}\/\w{6,9}\(\w\)\w{6}$/.test(value)) {
        throw new Error("Invalid format for NRC");
      }
      return true;
    }),
    body("passport").custom((value) => {
      // Check if the name contains special characters
      const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;
      if (specialCharsRegex.test(value)) {
        throw new Error("Passport cannot contain special characters");
      }
      // Return true to indicate validation passed
      return true;
    }),
    body("gender")
      .notEmpty()
      .custom((value) => {
        const validGenders = ["male", "female"];
        if (!validGenders.includes(value.toLowerCase())) {
          throw new Error(
            `Invalid gender. It must be one of: ${validGenders.join(", ")}`
          );
        }
        return true; // Validation passed
      }),
    body("partner_id")
      .notEmpty()
      .withMessage("Name is required")
      .isInt()
      .withMessage("id must be int")
      .toInt()
      .custom((value) => {
        // Check if the name contains special characters
        const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;
        if (specialCharsRegex.test(value)) {
          throw new Error("Name cannot contain special characters");
        }
        // Return true to indicate validation passed
        return true;
      }),
  ],
  async (req, res) => {
    console.log(req.body);
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json(new StatusCode.INVALID_ARGUMENT(errors.errors[0].msg));
      }

      console.log(req.body);
      console.log(req.file);

      const { name, dob, nrc, passport, gender, partner_id } = req.body;
      let imageUrl = null;

      if (req.file) {
        if (!req.file.mimetype.startsWith("image")) {
          return res.json(
            new StatusCode.UNKNOWN("Uploaded file must be an image.")
          );
        }

        const nextId = await Count.countStatus("patients");

        const uploadResult = await fileUpload(req.file, nextId.data);
        if (uploadResult.code !== "200") {
          return res.status(400).json(uploadResult);
        }
        imageUrl = uploadResult.data;
      }
      console.log({ name, dob, nrc, passport, gender, partner_id });
      console.log(imageUrl);

      const result = await Patient.patientCreate(
        name,
        dob,
        nrc === "" || nrc === "null" ? null : nrc,
        passport === "" || passport === "null" ? null : passport,
        gender,
        imageUrl
      );

      if (result.code !== "200") {
        if (imageUrl) {
          const deleteResult = await fileDelete(imageUrl);
          console.log("deleteResult", deleteResult);
        }
        res.json(result);
      }

      const isExist = await Partner.partnerCheck(
        result.data.insertId,
        partner_id
      );

      if (isExist.data.code == 404) {
        const partnerCreateResult = await Partner.partnerCreate(
          result.data.insertId,
          partner_id
        );
        return res.json(partnerCreateResult);
      }
      res.json(
        new StatusCode.ALREADY_EXISTS("New Partner is alreay connected!")
      );
    } catch (error) {
      res.json(new StatusCode.UNKNOWN(error.message));
    }
  }
);

///new Partner Create
router.post(
  "/partnerCreate",
  [
    body("name")
      .notEmpty()
      .withMessage("Name is required")
      .trim()
      .escape()
      .custom((value) => {
        // Check if the name contains special characters
        const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;
        if (specialCharsRegex.test(value)) {
          throw new Error("Name cannot contain special characters");
        }
        // Return true to indicate validation passed
        return true;
      }),
    body("dob")
      .notEmpty()
      .matches(/^\d{4}\/\d{2}\/\d{2}$/) // Matches format yyyy/mm/dd
      .withMessage("Date of birth must be in yyyy/mm/dd format"),
    body("nrc")
      .notEmpty()
      .matches(
        /^(\d{1}\/\w{6}\(\w\)\w{6}|\d{2}\/\w{6}\(\w\)\w{6}|\d{2}\/\w{7}\(\w\)\w{6}|\d{1}\/\w{7}\(\w\)\w{6}|\d{2}\/\w{7}\/\w{6}|\d{1}\/\w{7}\/\w{6}|\d{2}\/\w{8}\(\w\)\w{6}|\d{1}\/\w{8}\(\w\)\w{6}|\d{2}\/\w{9}\(\w\)\w{6}|\d{1}\/\w{9}\(\w\)\w{6})$/
      )
      .withMessage("Invalid format for NRC."),
    body("gender")
      .notEmpty()
      .custom((value) => {
        const validGenders = ["male", "female"];
        if (!validGenders.includes(value.toLowerCase())) {
          throw new Error(
            `Invalid gender. It must be one of: ${validGenders.join(", ")}`
          );
        }
        return true; // Validation passed
      }),
    body("partner_id")
      .notEmpty()
      .withMessage("Name is required")
      .isInt()
      .withMessage("id must be int")
      .toInt()
      .custom((value) => {
        // Check if the name contains special characters
        const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;
        if (specialCharsRegex.test(value)) {
          throw new Error("Name cannot contain special characters");
        }
        // Return true to indicate validation passed
        return true;
      }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json(new StatusCode.INVALID_ARGUMENT(errors.errors[0].msg));
      }
      const { name, dob, nrc, gender, partner_id } = req.body;
      const newPatient = await Patient.patientCreate(name, dob, nrc, gender);
      console.log(newPatient);
      if (newPatient.code != 200) {
        res.json(newPatient);
      }

      const isExist = await Partner.partnerCheck(
        newPatient.data.insertId,
        partner_id
      );

      if (isExist.data.code == 404) {
        res.json(
          await Partner.partnerCreate(newPatient.data.insertId, partner_id)
        );
      }
      res.json(
        new StatusCode.ALREADY_EXISTS("New Partner is alreay connected!")
      );
    } catch (error) {
      res.json(new StatusCode.UNKNOWN(error.message));
    }
  }
);

router.get(
  "/partnerList/:page",
  [param("page").notEmpty().isInt().toInt()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json(new StatusCode.INVALID_ARGUMENT(errors.errors[0].msg));
      }

      const page = req.params.page;

      const result = await Partner.partnerList(page);
      res.json(result);
    } catch (error) {
      res.json(new StatusCode.UNKNOWN(error.message));
    }
  }
);

router.put(
  "/partnertUpdate/:id",
  [
    body("patient_id_1")
      .notEmpty()
      .withMessage("ID is required")
      .trim()
      .escape()
      .custom((value) => {
        // Check if the value is an integer
        if (!Number.isInteger(Number(value))) {
          throw new Error("ID must be an integer");
        }
        // Check if the name contains special characters
        const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;
        if (specialCharsRegex.test(value)) {
          throw new Error("Name cannot contain special characters");
        }
        // Return true to indicate validation passed
        return true;
      }),
    body("patient_id_2")
      .notEmpty()
      .withMessage("ID is required")
      .trim()
      .escape()
      .custom((value) => {
        // Check if the value is an integer
        if (!Number.isInteger(Number(value))) {
          throw new Error("ID must be an integer");
        }

        // Check if the name contains special characters
        const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;
        if (specialCharsRegex.test(value)) {
          throw new Error("Name cannot contain special characters");
        }

        // Return true to indicate validation passed
        return true;
      }),
    param("id").notEmpty().isInt().toInt(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json(new StatusCode.INVALID_ARGUMENT(errors.errors[0].msg));
      }
      const { patient_id_1, patient_id_2 } = req.body;
      const { id } = req.params;
      const result = await Partner.partnerUpdate(
        patient_id_1,
        patient_id_2,
        id
      );
      res.json(result);
    } catch (error) {
      res.json(new StatusCode.UNKNOWN(error.message));
    }
  }
);

router.delete(
  "/partnerDelete/:id",
  [param("id").notEmpty().isInt().toInt()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json(new StatusCode.INVALID_ARGUMENT(errors.errors[0].msg));
      }

      const result = await Partner.partnerDelete(req.params.id);
      res.json(result);
    } catch (error) {
      res.json(new StatusCode.UNKNOWN(error.message));
    }
  }
);

router.post(
  "/partnerSearch",
  [
    body("patient_id")
      .notEmpty()
      .withMessage("ID is required")
      .trim()
      .escape()
      .custom((value) => {
        // Check if the value is an integer
        if (!Number.isInteger(Number(value))) {
          throw new Error("ID must be an integer");
        }
        // Check if the name contains special characters
        const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;
        if (specialCharsRegex.test(value)) {
          throw new Error("Name cannot contain special characters");
        }
        // Return true to indicate validation passed
        return true;
      }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json(new StatusCode.INVALID_ARGUMENT(errors.errors[0].msg));
      }
      const { patient_id } = req.body;
      const result = await Partner.partnerSearch(patient_id);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

//check partner if needed
router.post(
  "/partnerCheck",
  [
    body("patient_id")
      .notEmpty()
      .withMessage("ID is required")
      .trim()
      .escape()
      .custom((value) => {
        // Check if the value is an integer
        if (!Number.isInteger(Number(value))) {
          throw new Error("ID must be an integer");
        }
        // Check if the name contains special characters
        const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;
        if (specialCharsRegex.test(value)) {
          throw new Error("Name cannot contain special characters");
        }
        // Return true to indicate validation passed
        return true;
      }),
    body("partner_id")
      .notEmpty()
      .withMessage("ID is required")
      .trim()
      .escape()
      .custom((value) => {
        // Check if the value is an integer
        if (!Number.isInteger(Number(value))) {
          throw new Error("ID must be an integer");
        }
        // Check if the name contains special characters
        const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;
        if (specialCharsRegex.test(value)) {
          throw new Error("Name cannot contain special characters");
        }
        // Return true to indicate validation passed
        return true;
      }),
    body().custom((value, { req }) => {
      if (req.body.patient_id === req.body.partner_id) {
        throw new Error("Patient IDs must be different");
      }
      return true;
    }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json(new StatusCode.INVALID_ARGUMENT(errors.errors[0].msg));
      }
      const { patient_id, partner_id } = req.body;

      const result = await Partner.partnerCheck(patient_id, partner_id);
      res.json(result.data);
    } catch (error) {
      res.json(error);
    }
  }
);

module.exports = router;
