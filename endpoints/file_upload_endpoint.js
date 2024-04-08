const router = require("express").Router();
const fileUpload = require("../helper/file_upload_helper");
const StatusCode = require("../helper/status_code_helper");
const { param, body, validationResult } = require("express-validator");

router.post("/upload", fileUpload.upload.array("file", 12), (req, res) => {
  try {
    // Check if files were uploaded successfully
    if (!req.files || req.files.length === 0) {
      return res.json(new StatusCode.UNKNOWN("No files uploaded"));
    }
    // Access the uploaded files via req.files array
    const uploadedFiles = req.files;

    // Return file paths or other information about the uploaded files
    return res.json(new StatusCode.OK(uploadedFiles.map((file) => file.path)));
  } catch (error) {
    console.error(error);
    return res.status(500).json(new StatusCode.UNKNOWN(error.message));
  }
});

module.exports = router;
