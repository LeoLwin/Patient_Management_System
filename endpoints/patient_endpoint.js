const router = require("express").Router();
const Patient = require("../models/patient_model");
const StatusCode = require("../helper/status_code_helper");
const { param, body, validationResult } = require("express-validator");
const multer = require("multer");
const { fileUpload, fileDelete } = require("../helper/file_upload_helper");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post(
  "/patientCreate",
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
      .withMessage("Gender is required.")
      .custom((value) => {
        const validGenders = ["male", "female"];
        if (!validGenders.includes(value.toLowerCase())) {
          throw new Error(
            `Invalid gender. It must be one of: ${validGenders.join(", ")}`
          );
        }
        return true; // Validation passed
      }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json(new StatusCode.INVALID_ARGUMENT(errors.errors[0].msg));
      }
      const { name, dob, nrc, gender } = req.body;
      const result = await Patient.patientCreate(name, dob, nrc, gender);
      res.json(result);
    } catch (error) {
      res.status(error);
    }
  }
);

// router.post(
//   "/patientCreateWithPic",
//   upload.single("file"),
//   [
//     body("name")
//       .notEmpty()
//       .withMessage("Name is required")
//       .trim()
//       .escape()
//       .custom((value) => {
//         // Check if the name contains special characters
//         const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;
//         if (specialCharsRegex.test(value)) {
//           throw new Error("Name cannot contain special characters");
//         }
//         // Return true to indicate validation passed
//         return true;
//       }),
//     body("dob")
//       .notEmpty()
//       .matches(/^\d{4}\/\d{2}\/\d{2}$/) // Matches format yyyy/mm/dd
//       .withMessage("Date of birth must be in yyyy/mm/dd format"),
//     body("nrc")
//       .notEmpty()
//       .matches(
//         /^(\d{1}\/\w{6}\(\w\)\w{6}|\d{2}\/\w{6}\(\w\)\w{6}|\d{2}\/\w{7}\(\w\)\w{6}|\d{1}\/\w{7}\(\w\)\w{6}|\d{2}\/\w{7}\/\w{6}|\d{1}\/\w{7}\/\w{6}|\d{2}\/\w{8}\(\w\)\w{6}|\d{1}\/\w{8}\(\w\)\w{6}|\d{2}\/\w{9}\(\w\)\w{6}|\d{1}\/\w{9}\(\w\)\w{6})$/
//       )
//       .withMessage("Invalid format for NRC."),
//     body("gender")
//       .notEmpty()
//       .withMessage("Gender is required.")
//       .custom((value) => {
//         const validGenders = ["male", "female"];
//         if (!validGenders.includes(value.toLowerCase())) {
//           throw new Error(
//             `Invalid gender. It must be one of: ${validGenders.join(", ")}`
//           );
//         }
//         return true; // Validation passed
//       }),
//     body("file").custom((value, { req }) => {
//       // Check if a file was uploaded
//       if (!req.file) {
//         throw new Error("File is required");
//       }

//       // Check if the uploaded file is an image
//       if (!req.file.mimetype.startsWith("image")) {
//         throw new Error("Uploaded file must be an image");
//       }

//       return true; // Validation passed
//     }),
//   ],
//   async (req, res) => {
//     try {
//       const errors = validationResult(req);
//       if (!errors.isEmpty()) {
//         return res.json(new StatusCode.INVALID_ARGUMENT(errors.errors[0].msg));
//       }
//       const { name, dob, nrc, gender } = req.body;
//       const file = req.file;
//       const fileurl = await fileUpload(file);
//       if (fileurl.code == 200) {
//         const imageUrl = fileurl.data;
//         const result = await Patient.patientCreate(
//           name,
//           dob,
//           nrc,
//           gender,
//           imageUrl
//         );
//         res.json(new StatusCode.OK(result));
//       }
//       res.json(new StatusCode.UNKNOWN(fileurl));
//     } catch (error) {
//       res.status(error);
//     }
//   }
// );

router.get(
  "/patientList/:page",
  [param("page").notEmpty().isInt().toInt()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json(new StatusCode.INVALID_ARGUMENT(errors.errors[0].msg));
      }

      const page = req.params.page;

      const result = await Patient.patientList(page);
      res.json(result);
    } catch (error) {
      res.status(error);
    }
  }
);

router.put(
  "/patientUpdate/:id",
  upload.single("file"),
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
    param("id").notEmpty().isInt().toInt(),
    body("file").custom((value, { req }) => {
      // Check if a file was uploaded
      if (!req.file) {
        throw new Error("File is required");
      }

      // Check if the uploaded file is an image
      if (!req.file.mimetype.startsWith("image")) {
        throw new Error("Uploaded file must be an image");
      }

      return true; // Validation passed
    }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json(new StatusCode.INVALID_ARGUMENT(errors.errors[0].msg));
      }

      const { name, dob, nrc, gender } = req.body;
      const { id } = req.params;
      const file = req.file;

      const fileurl = await fileUpload(file);

      if (fileurl.code == 200) {
        const imageUrl = fileurl.data;
        const result = await Patient.patientUpdate(
          name,
          dob,
          nrc,
          gender,
          imageUrl,
          id
        );
        res.json(new StatusCode.OK(result));
      }
      res.json(new StatusCode.UNKNOWN(fileurl));

      // const result = await Patient.patientUpdate(name, dob, nrc, gender, id);
      // res.json(result);
    } catch (error) {
      res.status(error);
    }
  }
);

router.delete(
  "/patientDelete/:id",
  [param("id").notEmpty().isInt().toInt()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json(new StatusCode.INVALID_ARGUMENT(errors.errors[0].msg));
      }
      const id = req.params.id;
      const patient = await Patient.patientIdSearch(id);
      if (patient.code == 200) {
        const fileDelete = await filedelete(patient.data.result[0].imageUrl);
        if (fileDelete.code == 200) {
          const result = await Patient.patientDelete(id);
          res.json(result);
        }
        res.json(fileDelete);
      }
      res.json(patient);
    } catch (error) {
      res.status(error);
    }
  }
);

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
          throw new Error("Name cannot contain special characters");
        }
        // Return true to indicate validation passed
        return true;
      }),
    param("page").notEmpty().isInt().toInt(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json(new StatusCode.INVALID_ARGUMENT(errors.errors[0].msg));
      }

      const { name } = req.body;
      const page = req.params.page;
      const result = await Patient.patientNameSearch(name, page);
      res.json(result);
    } catch (error) {
      res.status(error);
    }
  }
);

router.post(
  "/patientNrcSearch",
  [
    body("nrc")
      .notEmpty()
      .matches(/^\d{2}\/......\(.\)......$|^\d\/......\(.\)......$/)
      .withMessage(
        "Invalid format for NRC. It should match the pattern ??/??????(?)?????? or ?/??????(?)??????"
      ),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json(new StatusCode.INVALID_ARGUMENT(errors.errors[0].msg));
      }
      const { nrc } = req.body;
      const result = await Patient.patientNrcSearch(nrc);
      res.json(result);
    } catch (error) {
      res.status(error);
    }
  }
);

router.post(
  "/patientIdSearch/:id",
  [param("id").notEmpty().isInt().toInt()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json(new StatusCode.INVALID_ARGUMENT(errors.errors[0].msg));
      }
      const result = await Patient.patientIdSearch(req.params.id);
      res.json(result);
    } catch (error) {
      res.status(error);
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
        return true; // Validation passed
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
      .withMessage("Gender is required.")
      .custom((value) => {
        const validGenders = ["male", "female"];
        if (!validGenders.includes(value.toLowerCase())) {
          throw new Error(
            `Invalid gender. It must be one of: ${validGenders.join(", ")}`
          );
        }
        return true; // Validation passed
      }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      if (!req.file) {
        return res.status(400).send("No file uploaded.");
      }

      if (!req.file.mimetype.startsWith("image")) {
        return res.status(400).send("Uploaded file must be an image.");
      }

      const { name, dob, nrc, gender } = req.body;
      const image = req.file;

      console.log(image);
      console.log({ name, dob, nrc, gender });
      const uploadResult = await fileUpload(image, nrc);

      if (uploadResult.code === "500") {
        return res.status(uploadResult.message);
      }

      if (uploadResult.code === "200") {
        const imageUrl = uploadResult.data;
        console.log(uploadResult.data);
        const result = await Patient.patientCreate(
          name,
          dob,
          nrc,
          gender,
          imageUrl
        );
        if (result.code !== "200") {
          console.log("imageUrl", imageUrl);
          console.log("equal 500");
          const deleteResult = await fileDelete(imageUrl);
          console.group("deleteResult", deleteResult);
          res.json(result);
        }

        res.json(result);
      }
      // Continue with your business logic here (e.g., saving the image and data to the database)
      res.json(uploadResult);
    } catch (error) {
      res.status(error);
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
    param("id").notEmpty().isInt().toInt(),
    body("image").custom((value, { req }) => {
      // Check if a file was uploaded
      if (!req.file) {
        throw new Error("Image is required");
      }

      // Check if the uploaded file is an image
      if (!req.file.mimetype.startsWith("image")) {
        throw new Error("Uploaded file must be an image");
      }

      return true; // Validation passed
    }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json(new StatusCode.INVALID_ARGUMENT(errors.errors[0].msg));
      }

      const { name, dob, nrc, gender } = req.body;
      const { id } = req.params;
      const image = req.file;
      console.log("Image", image);

      const patient = await Patient.patientIdSearch(id);
      console.log("Patient", patient);
      if (patient.code == 200) {
        console.log("Patient", patient.data.result[0].imageUrl);
        const deletResult = await fileDelete(patient.data.result[0].imageUrl);
        console.log("DeleteReslt", deletResult);
        if (deletResult.code == 200) {
          const file = await fileUpload(image, nrc);
          console.log("ImamgeUrl", file);
          const imageUrl = file.data;
          if (file.code == 200) {
            const result = await Patient.patientUpdate(
              name,
              dob,
              nrc,
              gender,
              imageUrl,
              id
            );
            await res.json(result);
          }
          res.json(fileurl);
        }
        if (fileurl.code == 200) {
          const imageUrl = fileurl.data;
          const result = await Patient.patientUpdate(
            name,
            dob,
            nrc,
            gender,
            imageUrl,
            id
          );
          res.json(new StatusCode.OK(result));
        }
        res.json(new StatusCode.UNKNOWN(fileurl));
      }

      res.json(patient);
    } catch (error) {
      res.status(error);
    }
  }
);

//delete with pic
router.delete(
  "/patientPicDelete/:id",
  [param("id").notEmpty().isInt().toInt()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json(new StatusCode.INVALID_ARGUMENT(errors.errors[0].msg));
      }
      const id = req.params.id;
      const patient = await Patient.patientIdSearch(id);
      if (patient.code == 200) {
        console.log(patient.data);
        const deletResult = await fileDelete(patient.data.result[0].imageUrl);
        console.log(deletResult);
        if (deletResult.code == 200) {
          const result = await Patient.patientDelete(id);
          res.json(result);
        }
        res.json(deletResult);
      }
      res.json(patient);
    } catch (error) {
      res.status(error);
    }
  }
);

module.exports = router;

// router.post(
//   "/patientFirebaseUpload",
//   upload.single("file"),
//   async (req, res) => {
//     try {
//       if (!req.file) {
//         return res.status(400).send("No file uploaded.");
//       }
//       const { name } = req.body;
//       const fileBuffer = req.file.buffer;
//       const originalFileName = req.file.originalname;
//       // const uniqueFileName = Date.now() + "-" + originalFileName; // Generate a unique file name
//       await bucket.file(originalFileName).save(fileBuffer);
//       // Send the uploaded file path as a response

//       // Get the download URL of the uploaded file
//       const [url] = await bucket
//         .file(originalFileName)
//         .getSignedUrl({ action: "read", expires: "01-01-2030" });
//       res.status(200).send(`${url}`);
//     } catch (error) {
//       console.error(error);
//       res.status(500).send(error);
//     }
//   }
// );

// router.post("/patientFirebaseDelete", async (req, res) => {
//   try {
//     const fileUrl = req.body.file;
//     if (!fileUrl) {
//       return res.status(400).send("No file URL provided.");
//     }
//     const { pathname } = new URL(fileUrl);
//     let filePath = decodeURIComponent(pathname.substring(1)); // Remove leading '/' and decode URI components
//     const bucketNameIndex = filePath.indexOf("/");
//     if (bucketNameIndex !== -1) {
//       filePath = filePath.substring(bucketNameIndex + 1);
//       console.log(" filePath : ", filePath);
//     }

//     // // Create a reference to the file to delete
//     const fileRef = bucket.file(filePath);

//     // Delete the file
//     await fileRef.delete();
//     res.json(new StatusCode.OK("Deleting"));
//     // res.json(fileRef);
//   } catch (error) {
//     console.error(error);
//     res.status(new StatusCode.UNKNOWN(error.message));
//   }
// });

module.exports = router;
