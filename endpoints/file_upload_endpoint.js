const router = require("express").Router();
const fileUpload = require("../helper/file_upload_helper");
const StatusCode = require("../helper/status_code_helper");
const fs = require("fs-extra");

router.post(
  "/upload",
  fileUpload.upload.array("file", 12),
  async (req, res) => {
    try {
      // Check if files were uploaded successfully
      if (!req.files || req.files.length === 0) {
        return res.json(new StatusCode.UNKNOWN("No files uploaded"));
      }
      // Access the uploaded files via req.files array
      const uploadedFiles = req.files;
      const result = fileUpload.progress(uploadedFiles, res);
      return new StatusCode.OK(result);
    } catch (error) {
      console.error(error);
      return res.json(new StatusCode.UNKNOWN(error.message));
    }
  }
);

router.delete("/delete", async (req, res) => {
  try {
    
  } catch (error) {
    console.error(error);
    return res.json(new StatusCode.UNKNOWN(error.message));
  }
});

module.exports = router;
