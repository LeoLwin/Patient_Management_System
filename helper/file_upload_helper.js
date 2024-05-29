const multer = require("multer");
const path = require("path");
const StatusCode = require("../helper/status_code_helper");
const fs = require("fs-extra");
const { v4: uuidv4 } = require("uuid");

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

const sanitizeFileName = (nrc) => {
  return nrc.replace(/\//g, "_");
};

const fileUpload = async (file, id) => {
  try {
    const uploadFile = file.buffer;
    // Convert id to string
    const idStr = String(id);

    const uniqueFileName = `${uuidv4()}-${file.originalname}`;
    const uploadDir = path.join(__dirname, "../uploads", idStr);
    const filePath = path.join(uploadDir, uniqueFileName);

    // Ensure the directory exists
    await fs.mkdir(uploadDir, { recursive: true });

    // Write the file to the specified directory
    await fs.writeFile(filePath, uploadFile);

    console.log(`File saved to ${filePath}`);

    // Construct the file URL
    const baseUrl = "http://localhost:3000/images/"; // Replace with your actual base URL
    // const fileUrl = `${baseUrl}${uniqueFileName}`;
    const fileUrl = `${baseUrl}${idStr}/${uniqueFileName}`;

    return new StatusCode.OK(fileUrl);
  } catch (error) {
    console.error(error);
    return new StatusCode.OK(error.message);
  }
};

const fileDelete = async (fileUrl) => {
  try {
    console.log("Original fileUrl:", fileUrl);
    const { pathname } = new URL(fileUrl);
    let filePath = decodeURIComponent(pathname.substring(1)); // Remove leading '/' and decode URI components
    console.log("Decoded filePath:", filePath);

    // Construct the full path to the file
    const fullPath = path.join(
      __dirname,
      "../uploads",
      filePath.replace(/^images\//, "")
    );
    console.log("Full path:", fullPath);

    // Remove the file
    await fs.unlink(fullPath);
    console.log("File deleted successfully");

    return new StatusCode.OK(null, "File is deleted");
  } catch (error) {
    console.error(error);
    return new StatusCode.UNKNOWN(error.message);
  }
};

module.exports = { upload, fileDelete, fileUpload };
