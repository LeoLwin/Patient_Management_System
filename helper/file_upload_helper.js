const multer = require("multer");
const path = require("path");
const StatusCode = require("../helper/status_code_helper");
const fs = require("fs-extra");
const { stat } = require("fs");

// Define storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/")); // Destination folder for uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Rename the file to include the timestamp
  },
});

// Initialize Multer with the storage configuration
const upload = multer({ storage: storage });

const progress = async (uploadedFiles, res) => {
  try {
    // Start tracking progress
    let filesUploaded = 0;

    // Iterate over uploaded files
    for (let i = 0; i < uploadedFiles.length; i++) {
      filesUploaded++;
      const showProgress = (filesUploaded / uploadedFiles.length) * 100;

      // Send progress update to the client for each file
      res.write(
        `data: ${JSON.stringify({
          showProgress,
          filePath: uploadedFiles[i].path,
        })}\n\n`
      );

      // // Simulate delay (you can remove this in production)
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    // Send final response indicating completion
    res.write(
      `data: ${JSON.stringify({
        progress: 100,
        message: "Upload completed",
      })}\n\n`
    );
    res.end();
  } catch (error) {
    console.error(error);
    return res.json(new StatusCode.UNKNOWN(error.message));
  }
};

const fileDelete = async (filePath) => {
  try {
    await fs.remove(filePath, (err) => {
      if (err) return new StatusCode.UNKNOWN(err);
    });
    return new StatusCode.OK(null, "File is deleted");
  } catch (error) {
    console.error(error);
    return new StatusCode.UNKNOWN(error.message);
  }
};

module.exports = { upload, progress, fileDelete };
