const router = require("express").Router();
const FileUpload = require("../helper/file_upload_helper");
const File = require("../models/file_model");
const StatusCode = require("../helper/status_code_helper");
const { param, body, validationResult } = require("express-validator");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//file Only upload
router.post("/fileOnlyUpload", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    const url = await fileUpload.fileOnlyUpload(file);
    res.json(new StatusCode.OK(url));
  } catch (error) {
    return res.status(new StatusCode.UNKNOWN(error.message));
  }
});

//file only delete
router.delete("/delete", async (req, res) => {
  try {
    const path = req.body;
    console.log(path.filePath);
    const result = await FileUpload.fileDelete(path.filePath);
    return res.json(result);
  } catch (error) {
    return res.status(new StatusCode.UNKNOWN(error.message));
  }
});

router.post(
  "/fileCreate",
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
    body("patient_id")
      .notEmpty()
      .withMessage("Patient_id is required")
      .trim()
      .escape()
      .custom((value) => {
        // Check if the value is an integer
        if (!Number.isInteger(Number(value))) {
          throw new Error("Patient_id must be an integer");
        }

        // Check if the name contains special characters
        const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;
        if (specialCharsRegex.test(value)) {
          throw new Error("Patient_id cannot contain special characters");
        }

        // Return true to indicate validation passed
        return true;
      }),
    body("type")
      .notEmpty()
      .withMessage("Type is required")
      .trim()
      .escape()
      .custom((value) => {
        // Check if the name contains special characters
        const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;
        if (specialCharsRegex.test(value)) {
          throw new Error("Type cannot contain special characters");
        }
        // Return true to indicate validation passed
        return true;
      }),

    body("file").custom((value, { req }) => {
      if (!req.file && !req.body.path) {
        throw new Error("Either file or Folder Name must be provided");
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
        const file = req.file;

        const uploadResult = await FileUpload.fileOnlyUpload(file);

        if (uploadResult.code === "500") {
          return res.status(uploadResult.message);
        }
        const mb = await FileUpload.fileByteToSize(file.size);

        const { patient_id, name, type } = req.body;
        const path = uploadResult.data;
        const size = mb.data;
        const result = await File.fileCreate(
          patient_id,
          name,
          path,
          size,
          type
        );
        res.json(result);
      } else {
        const { patient_id, name, path, type } = req.body;
        const size = "0MB";
        const result = await File.fileCreate(
          patient_id,
          name,
          path,
          size,
          type
        );
        res.json(result);
      }

      // res.json(req.file);
    } catch (error) {
      return res.status(new StatusCode.UNKNOWN(error.message));
    }
  }
);

router.get(
  "/fileList/:page",
  [param("page").notEmpty().isInt().toInt()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json(new StatusCode.INVALID_ARGUMENT(errors.errors[0].msg));
      }
      const { page } = req.params;
      const result = await File.fileList(page);
      res.json(result);
    } catch (error) {
      res.status(error);
    }
  }
);

router.put(
  "/fileUpdate/:id",
  // [
  //   body("name")
  //     .notEmpty()
  //     .withMessage("Name is required")
  //     .trim()
  //     .escape()
  //     .custom((value) => {
  //       // Check if the name contains special characters
  //       const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;
  //       if (specialCharsRegex.test(value)) {
  //         throw new Error("Name cannot contain special characters");
  //       }
  //       // Return true to indicate validation passed
  //       return true;
  //     }),
  //   body("patient_id")
  //     .notEmpty()
  //     .withMessage("Patient_id is required")
  //     .trim()
  //     .escape()
  //     .custom((value) => {
  //       // Check if the value is an integer
  //       if (!Number.isInteger(Number(value))) {
  //         throw new Error("Patient_id must be an integer");
  //       }

  //       // Check if the name contains special characters
  //       const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;
  //       if (specialCharsRegex.test(value)) {
  //         throw new Error("Patient_id cannot contain special characters");
  //       }

  //       // Return true to indicate validation passed
  //       return true;
  //     }),
  //   body("type")
  //     .notEmpty()
  //     .withMessage("Type is required")
  //     .trim()
  //     .escape()
  //     .custom((value) => {
  //       // Check if the name contains special characters
  //       const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;
  //       if (specialCharsRegex.test(value)) {
  //         throw new Error("Type cannot contain special characters");
  //       }
  //       // Return true to indicate validation passed
  //       return true;
  //     }),

  //   body("file").custom((value, { req }) => {
  //     if (!req.file && !req.body.path) {
  //       throw new Error("Either file or Folder Name must be provided");
  //     }
  //     return true;
  //   }),
  //   param("id").notEmpty().isInt().toInt(),
  // ],
  async (req, res) => {
    try {
      // const errors = validationResult(req);
      // if (!errors.isEmpty()) {
      //   return res.json(new StatusCode.INVALID_ARGUMENT(errors.errors[0].msg));
      // }
      console.log("hello");
      console.log(req.body);
      console.log(req.file);
      const { patient_id, name, type, path: pathUrl } = req.body;
      const { id } = req.params;
      let path;

      // console.log({ patient_id, name, type, path: pathUrl });

      // if (req.file) {
      //   const file = req.file;

      //   const uploadResult = await FileUpload.fileOnlyUpload(file);

      //   if (uploadResult.code === "500") {
      //     return res.status(uploadResult.message);
      //   }
      //   const mb = await FileUpload.fileByteToSize(file.size);

      //   const { patient_id, name, type } = req.body;
      //   const path = uploadResult.data;
      //   const size = mb.data;
      //   const result = await File.fileUpdate(
      //     patient_id,
      //     name,
      //     path,
      //     size,
      //     type
      //   );
      //   res.json(result);
      // } else {
      //   const { patient_id, name, path, type } = req.body;
      //   const size = "0MB";
      //   const result = await File.fileUpdate(
      //     patient_id,
      //     name,
      //     path,
      //     size,
      //     type
      //   );
      //   res.json(result);
      // }

      // res.json(req.file);
    } catch (error) {
      return res.status(new StatusCode.UNKNOWN(error.message));
    }
  }
);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.post(
  "/fileCreate",
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
    body("file_name").notEmpty().withMessage("file_name is required").escape(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json(new StatusCode.INVALID_ARGUMENT(errors.errors[0].msg));
      }
      const { patient_id, file_name } = req.body;
      const result = await File.fileCreate(patient_id, file_name);
      return res.json(result);
    } catch (error) {
      console.log(error);
      res.status(error);
    }
  }
);

router.put(
  "/fileUpdate/:id",
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
    body("file_name")
      .notEmpty()
      .withMessage("file_name is required")
      .trim()
      .escape(),
    param("id").notEmpty().isInt().toInt(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json(new StatusCode.INVALID_ARGUMENT(errors.errors[0].msg));
      }
      const { patient_id, file_name } = req.body;
      const { id } = req.params;
      const result = await File.fileUpdate(patient_id, file_name, id);
      res.json(result);
    } catch (error) {
      res.status(error);
    }
  }
);

router.delete(
  "/fileDelete/:id",
  [param("id").notEmpty().isInt().toInt()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json(new StatusCode.INVALID_ARGUMENT(errors.errors[0].msg));
    }
    const { id } = req.params;
    const result = await File.fileDelete(id);
    res.json(result);
    try {
    } catch (error) {
      res.status(error);
    }
  }
);

module.exports = router;

// router.post("/upload", fileUpload.upload.array("file"), async (req, res) => {
//   try {
//     // Check if files were uploaded successfully
//     if (!req.files || req.files.length === 0) {
//       return res.json(new StatusCode.UNKNOWN("No files uploaded"));
//     }
//     const filePaths = req.files.map((file) => file.path);
//     // Send the paths of the uploaded files as a response
//     return res.json(new StatusCode.OK(filePaths));
//   } catch (error) {
//     console.error(error);
//     return res.json(new StatusCode.UNKNOWN(error.message));
//   }
// });
