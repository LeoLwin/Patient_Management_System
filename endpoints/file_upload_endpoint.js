const router = require("express").Router();
const fileUpload = require("../helper/file_upload_helper");
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

router.post("/fileCreate", upload.single("path"), [], async (req, res) => {
  try {
    console.log(req.body);
    console.log(req.file);

    // res.json(req.file);
  } catch (error) {
    return res.status(new StatusCode.UNKNOWN(error.message));
  }
});

router.delete("/delete", async (req, res) => {
  try {
    const path = req.body;
    console.log(path.filePath);
    const result = await fileUpload.fileDelete(path.filePath);
    return res.json(result);
  } catch (error) {
    return res.status(new StatusCode.UNKNOWN(error.message));
  }
});

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
