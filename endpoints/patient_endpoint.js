const router = require("express").Router();
const Patient = require("../models/patient_model");
const StatusCode = require("../helper/status_code_helper");
const Count = require("../models/count_status");
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

//patientNrcSearch
router.post(
  "/patientNrcSearch",
  [
    body("nrc")
      .notEmpty()
      .matches(
        /^(\d{1}\/\w{6}\(\w\)\w{6}|\d{2}\/\w{6}\(\w\)\w{6}|\d{2}\/\w{7}\(\w\)\w{6}|\d{1}\/\w{7}\(\w\)\w{6}|\d{2}\/\w{7}\/\w{6}|\d{1}\/\w{7}\/\w{6}|\d{2}\/\w{8}\(\w\)\w{6}|\d{1}\/\w{8}\(\w\)\w{6}|\d{2}\/\w{9}\(\w\)\w{6}|\d{1}\/\w{9}\(\w\)\w{6})$/
      )
      .withMessage("Invalid format for NRC."),
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

//patientIdSearch/:id
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
        return res.json(new StatusCode.PERMISSION_DENIED("No file uploaded."));
      }

      if (!req.file.mimetype.startsWith("image")) {
        return res.json(
          new StatusCode.PERMISSION_DENIED("Uploaded file must be an image.")
        );
      }

      const { name, dob, nrc, gender } = req.body;
      const image = req.file;

      // console.log(image);
      // console.log({ name, dob, nrc, gender });

      const nextId = await Count.countStatus("patients");
      console.log(nextId);
      if (nextId.code == 200) {
        const uploadResult = await fileUpload(image, nextId.data);
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
      }

      res.json(nextId);
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
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json(new StatusCode.INVALID_ARGUMENT(errors.errors[0].msg));
      }

      const { name, dob, nrc, gender, image: imageUrl } = req.body;
      const { id } = req.params;
      let image;

      if (req.file) {
        // If a file is uploaded, process the file
        image = req.file;
        console.log({ name, dob, nrc, gender, image });
        console.log(id);
      } else if (imageUrl) {
        // If an image URL is provided, use the URL
        image = imageUrl;
        console.log({ name, dob, nrc, gender, image });
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
        nrc,
        gender,
        newImageUrl,
        id
      );
      return res.json(updateResult);

      // res.json(patient);
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
      res.status(error);
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

//update with pic
// router.put(
//   "/patientPicUpdate/:id",
//   upload.single("image"),
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
//       .custom((value) => {
//         const validGenders = ["male", "female"];
//         if (!validGenders.includes(value.toLowerCase())) {
//           throw new Error(
//             `Invalid gender. It must be one of: ${validGenders.join(", ")}`
//           );
//         }
//         return true; // Validation passed
//       }),
//     param("id").notEmpty().isInt().toInt(),
//     body("image").custom((value, { req }) => {
//       // Check if a file was uploaded
//       if (!req.file) {
//         throw new Error("Image is required");
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
//       const { id } = req.params;
//       const image = req.file;
//       console.log("Image", image);

//       const patient = await Patient.patientIdSearch(id);
//       console.log("Patient", patient);
//       if (patient.code == 200) {
//         console.log("Patient", patient.data.result[0].imageUrl);
//         const deletResult = await fileDelete(patient.data.result[0].imageUrl);
//         console.log("DeleteReslt", deletResult);
//         if (deletResult.code == 200) {
//           const file = await fileUpload(image, nrc);
//           console.log("ImamgeUrl", file);
//           const imageUrl = file.data;
//           if (file.code == 200) {
//             const result = await Patient.patientUpdate(
//               name,
//               dob,
//               nrc,
//               gender,
//               imageUrl,
//               id
//             );
//             await res.json(result);
//           }
//           res.json(fileurl);
//         }
//         if (fileurl.code == 200) {
//           const imageUrl = fileurl.data;
//           const result = await Patient.patientUpdate(
//             name,
//             dob,
//             nrc,
//             gender,
//             imageUrl,
//             id
//           );
//           res.json(new StatusCode.OK(result));
//         }
//         res.json(new StatusCode.UNKNOWN(fileurl));
//       }

//       res.json(patient);
//     } catch (error) {
//       res.status(error);
//     }
//   }
// );

module.exports = router;
