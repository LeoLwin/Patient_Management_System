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
    console.error(error);
    return res.status(new StatusCode.UNKNOWN(error.message));
  }
});

module.exports = router;
