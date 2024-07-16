const router = require("express").Router();
const Patient = require("../models/patient_model");
const StatusCode = require("../helper/status_code_helper");
const Count = require("../models/count_status");
const { param, body, validationResult } = require("express-validator");
const multer = require("multer");
const { fileUpload, fileDelete } = require("../helper/file_upload_helper");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get(
  "/patientList/:page",
  [
    param("page")
      .notEmpty()
      .isInt()
      .withMessage("Page must be integer.")
      .toInt(),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json(new StatusCode.INVALID_ARGUMENT(errors.errors[0].msg));
      }
      next();
    },
  ],
  async (req, res) => {
    try {
      const page = req.params.page;

      const result = await Patient.patientList(page);
      console.log(result.data.list[0]);
      res.json(result);
    } catch (error) {
      res.json(new StatusCode.UNKNOWN(error.message));
    }
  }
);

//patientNameSearch
router.post(
  "/patientNameSearch/:page",
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
          throw new StatusCode.UNKNOWN(
            "Name cannot contain special characters"
          );
        }
        // Return true to indicate validation passed
        return true;
      }),
    param("page").notEmpty().isInt().toInt(),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json(
          new StatusCode.INVALID_ARGUMENT(errors.errors[0].msg.message)
        );
      }
      next();
    },
  ],
  async (req, res) => {
    console.log("Name Search : ", req.body);
    try {
      const { name } = req.body;
      const page = req.params.page;
      const result = await Patient.patientNameSearch(name, page);
      console.log("Patient Name Search : ", result);
      res.json(result);
    } catch (error) {
      res.json(new StatusCode.UNKNOWN(error.message));
    }
  }
);

//patientNrcSearch
router.post(
  "/patientNrcSearch",
  [
    body("nrc")
      .notEmpty()
      .custom((value) => {
        const regex =
          /^(\d{1}\/\w{6}\(\w\)\w{6}|\d{2}\/\w{6}\(\w\)\w{6}|\d{2}\/\w{7}\(\w\)\w{6}|\d{1}\/\w{7}\(\w\)\w{6}|\d{2}\/\w{7}\/\w{6}|\d{1}\/\w{7}\/\w{6}|\d{2}\/\w{8}\(\w\)\w{6}|\d{1}\/\w{8}\(\w\)\w{6}|\d{2}\/\w{9}\(\w\)\w{6}|\d{1}\/\w{9}\(\w\)\w{6})$/;
        if (!regex.test(value)) {
          throw new StatusCode.UNKNOWN("Invalid format for NRC.");
        }
        return true;
      }),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json(
          new StatusCode.INVALID_ARGUMENT(errors.errors[0].msg.message)
        );
      }
      next();
    },
  ],
  async (req, res) => {
    try {
      const { nrc } = req.body;
      const result = await Patient.patientNrcSearch(nrc);
      res.json(result);
    } catch (error) {
      res.json(new StatusCode.UNKNOWN(error.message));
    }
  }
);

//patientIdSearch/:id
router.post(
  "/patientIdSearch/:id",
  [
    param("id").notEmpty().isInt().withMessage("ID must be integer.").toInt(),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json(new StatusCode.INVALID_ARGUMENT(errors.errors[0].msg));
      }
      next();
    },
  ],
  async (req, res) => {
    console.log(req.params);
    try {
      const result = await Patient.patientIdSearch(req.params.id);
      res.json(result);
    } catch (error) {
      res.json(new StatusCode.UNKNOWN(error.message));
    }
  }
);

//passportSearch
router.post(
  "/passportSearch",
  [
    body("passport")
      .notEmpty()
      .withMessage("Passport is required")
      .trim()
      .escape()
      .custom((value) => {
        // Check if the name contains special characters
        const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;
        if (specialCharsRegex.test(value)) {
          throw new StatusCode.UNKNOWN(
            "Passport cannot contain special characters"
          );
        }
        // Return true to indicate validation passed
        return true;
      }),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json(
          new StatusCode.INVALID_ARGUMENT(errors.errors[0].msg.message)
        );
      }
      next();
    },
  ],
  async (req, res) => {
    console.log("Passport Search : ", req.body);
    try {
      const { passport } = req.body;
      const result = await Patient.patientPassportSearch(passport);
      console.log("Patient Name Search : ", result);
      res.json(result);
    } catch (error) {
      res.json(new StatusCode.UNKNOWN(error.message));
    }
  }
);

//create with pic
router.post(
  "/patientPicUpload",
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
    body("image").custom((value, { req }) => {
      if (!req.file && !req.body.image) {
        throw new Error("Either image file or image URL must be provided");
      }
      if (req.file && !req.file.mimetype.startsWith("image")) {
        throw new Error("Uploaded file must be an image");
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

      if (req.file) {
        if (!req.file.mimetype.startsWith("image")) {
          return res.json(
            new StatusCode.PERMISSION_DENIED("Uploaded file must be an image.")
          );
        }
      }
      if (req.body.nrc == "null" && req.body.passport == "null") {
        return res.json(
          new StatusCode.PERMISSION_DENIED(
            "You need To fill  one of NRC and PASSPORT !"
          )
        );
      }

      if (req.body.image == "null" || req.body.image == "") {
        console.log(" True Situation  of req.body.image: ", req.body);
        const { name, dob, nrc, passport, gender, image } = req.body;

        const result = await Patient.patientCreate(
          name,
          dob,
          nrc === "" || nrc === "null" ? null : nrc,
          passport === "" || passport === "null" ? null : passport,
          gender,
          image
        );
        console.log(result);
        res.json(result);
        return;
      }

      console.log(req.body);
      console.log(req.file);
      const { name, dob, nrc, passport, gender } = req.body;
      if (nrc == "null" && passport == "null") {
        return res.json(
          new StatusCode.PERMISSION_DENIED(
            "You need To fill  one of NRC and PASSPORT !"
          )
        );
      }

      const imageFile = req.file;

      const nextId = await Count.countStatus("patients");
      if (nextId.code == 200) {
        const uploadResult = await fileUpload(imageFile, nextId.data);
        if (uploadResult.code === "500") {
          return res.status(uploadResult.message);
        }

        if (uploadResult.code === "200") {
          const imageUrl = uploadResult.data;
          console.log(uploadResult.data);
          const result = await Patient.patientCreate(
            name,
            dob,
            nrc === "" || nrc === "null" ? null : nrc,
            passport === "" || passport === "null" ? null : passport,
            gender,
            imageUrl
          );
          if (result.code !== "200") {
            console.log("imageUrl", imageUrl);
            console.log("equal 500");
            const deleteResult = await fileDelete(imageUrl);
            console.group("deleteResult", deleteResult);
            res.json(result);
            return;
          }

          res.json(result);
          return;
        }
        // Continue with your business logic here (e.g., saving the image and data to the database)
        res.json(uploadResult);
      }

      res.json(nextId);
    } catch (error) {
      res.json(new StatusCode.UNKNOWN(error.message));
    }
  }
);

//update with pic
router.put(
  "/patientPicUpdate/:id",
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
    body("image").custom((value, { req }) => {
      if (!req.file && !req.body.image) {
        throw new Error("Either image file or image URL must be provided");
      }
      if (req.file && !req.file.mimetype.startsWith("image")) {
        throw new Error("Uploaded file must be an image");
      }

      return true;
    }),
    param("id").notEmpty().isInt().toInt(),
  ],
  async (req, res) => {
    console.log("Patient Update endpoint : ", req.body);
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json(new StatusCode.INVALID_ARGUMENT(errors.errors[0].msg));
      }

      const { name, dob, nrc, passport, gender, image: imageUrl } = req.body;
      if (nrc == "null" && passport == "null") {
        return res.json(
          new StatusCode.PERMISSION_DENIED(
            "You need To fill  one of NRC and PASSPORT !"
          )
        );
      }
      const { id } = req.params;
      let image;

      if (req.file) {
        // If a file is uploaded, process the file
        image = req.file;
        console.log({ name, dob, nrc, passport, gender, image });
        console.log(id);
      } else if (imageUrl) {
        // If an image URL is provided, use the URL
        image = imageUrl;
        console.log({ name, dob, nrc, passport, gender, image });
        console.log(id);
      }

      const patient = await Patient.patientIdSearch(id);
      console.log(patient);
      if (patient.code == 200) {
        const currentImageUrl = patient.data.result[0].imageUrl;
        console.log("Patient", currentImageUrl);
        if (req.file && currentImageUrl) {
          // If a new file is uploaded, delete the old image
          const deleteResult = await fileDelete(currentImageUrl);
          console.log("Delete Result", deleteResult);
        }
      }
      let newImageUrl;
      if (req.file) {
        // Upload new image and get the URL
        const uploadResult = await fileUpload(image, id);
        console.log("Uploaded Image URL", uploadResult);
        if (uploadResult.code === "200") {
          newImageUrl = uploadResult.data;
          console.log(newImageUrl);
        } else {
          return res.json({ uploadResult: "File upload failed" });
        }
      } else if (imageUrl) {
        // Use the provided image URL
        newImageUrl = imageUrl;
      }

      // Update patient with the new image URL
      const updateResult = await Patient.patientUpdate(
        name,
        dob,
        nrc === "" || nrc === "null" ? null : nrc,
        passport === "" || passport === "null" ? null : passport,
        gender,
        newImageUrl,
        id
      );
      return res.json(updateResult);

      // res.json(patient);
    } catch (error) {
      res.json(new StatusCode.UNKNOWN(error.message));
    }
  }
);

//delete with pic
router.delete(
  "/patientPicDelete/:id",
  [
    param("id").notEmpty().isInt().withMessage("ID must be integer.").toInt(),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log(errors);
        return res.json(new StatusCode.INVALID_ARGUMENT(errors.errors[0].msg));
      }
      next();
    },
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json(new StatusCode.INVALID_ARGUMENT(errors.errors[0].msg));
      }
      const id = req.params.id;
      const patient = await Patient.patientIdSearch(id);

      if (patient.code == 200) {
        console.log(patient.code == 200, "595");
        console.log(patient.data.result[0].imageUrl == "null", "596");

        if (patient.data.result[0].imageUrl != "null") {
          console.log("Patient Data: 599", patient.data);
          const deleteResult = await fileDelete(
            patient.data.result[0].imageUrl
          );
          console.log("603 : ", deleteResult);
        }

        console.log(patient.data.result[0].imageUrl == null, "607");

        const result = await Patient.patientDelete(id);
        console.log(result);
        return res.json(result);
      } else {
        return res.json(patient);
      }
    } catch (error) {
      res.json(new StatusCode.UNKNOWN(error.message));
    }
  }
);

//delete only pic
router.delete(
  "/deleteOnlyPic",
  [body("fileUrl").notEmpty().withMessage("Url is required")],
  async (req, res) => {
    try {
      const { fileUrl } = req.body;
      fileDelete(fileUrl)
        .then((response) => {
          res.json(response);
        })
        .catch((error) => {
          res.json(error);
        });
    } catch (error) {
      res.json(new StatusCode.UNKNOWN(error.message));
    }
  }
);

//countStatus
router.get("/patientsCountStatus", async (req, res) => {
  try {
    const { table } = req.body;
    console.log(table);
    const result = await Count.countStatus(table);
    res.json(result);
  } catch (error) {
    res.status(error.message);
  }
});

router.post(
  "/overAllPatientData",
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
          throw new Error("ID cannot contain special characters");
        }
        // Return true to indicate validation passed
        return true;
      }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const id = req.body.patient_id;
      const result = await Patient.overAllPatientData(id);
      console.log(result);
      res.json(result);
    } catch (error) {
      res.status(error.message);
    }
  }
);

module.exports = router;

module.exports = router;
