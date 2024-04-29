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

module.exports = { upload, fileDelete };
