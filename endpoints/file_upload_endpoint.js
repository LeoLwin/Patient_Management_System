const router = require("express").Router();
const fileUpload = require("../helper/file_upload_helper");
const StatusCode = require("../helper/status_code_helper");
const fs = require("fs-extra");

router.post("/upload", fileUpload.upload.array("file"), async (req, res) => {
  try {
    // Check if files were uploaded successfully
    if (!req.files || req.files.length === 0) {
      return res.json(new StatusCode.UNKNOWN("No files uploaded"));
    }
    const filePaths = req.files.map((file) => file.path);
    // Send the paths of the uploaded files as a response
    return res.json(new StatusCode.OK(filePaths));
  } catch (error) {
    console.error(error);
    return res.json(new StatusCode.UNKNOWN(error.message));
  }
});

router.delete("/delete", async (req, res) => {
  try {
    const path = req.body;
    const result = await fileUpload.fileDelete(path.filePath);
    return res.json(result);
  } catch (error) {
    return res.status(new StatusCode.UNKNOWN(error.message));
  }
});

// router.post(
//   "/fileSave",
//   [
//     body("patient_id")
//       .notEmpty()
//       .withMessage("ID is required")
//       .trim()
//       .escape()
//       .custom((value) => {
//         // Check if the value is an integer
//         if (!Number.isInteger(Number(value))) {
//           throw new Error("ID must be an integer");
//         }
//         // Check if the name contains special characters
//         const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;
//         if (specialCharsRegex.test(value)) {
//           throw new Error("Name cannot contain special characters");
//         }
//         // Return true to indicate validation passed
//         return true;
//       }),
//     body("file_name")
//       .notEmpty()
//       .withMessage("ID is required")
//       .trim()
//       .escape()
//       .custom((value) => {
//         // Check if the value is an integer
//         if (!Number.isInteger(Number(value))) {
//           throw new Error("ID must be an integer");
//         }

//         // Check if the name contains special characters
//         const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;
//         if (specialCharsRegex.test(value)) {
//           throw new Error("Name cannot contain special characters");
//         }

//         // Return true to indicate validation passed
//         return true;
//       }),
//     body().custom((value, { req }) => {
//       if (req.body.patient_id_1 === req.body.patient_id_2) {
//         throw new Error("Patient IDs must be different");
//       }
//       return true;
//     }),
//   ],
//   async (req, res) => {
//     try {
//     } catch (error) {
//       return res.status(new StatusCode.UNKNOWN(error.message));
//     }
//   }
// );

module.exports = router;
