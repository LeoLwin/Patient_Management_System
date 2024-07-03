const config = require("../configurations/config");
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
    const baseUrl = `http://${config.LOCALHOST}:${config.PORT}/uploads/`; // Replace with your actual base URL
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
      filePath.replace(/^uploads\//, "")
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

const fileOnlyUpload = async (file) => {
  try {
    const uniqueFileName = `${uuidv4()}-${file.originalname}`;
    const uploadDir = path.join(__dirname, "../uploads");
    const filePath = path.join(uploadDir, uniqueFileName);

    // Ensure the directory exists
    await fs.mkdir(uploadDir, { recursive: true });

    // Write the file to the specified directory
    await fs.writeFile(filePath, file.buffer); // file.buffer for the file content

    console.log(`File saved to : ${uploadDir}`);
    console.log("FIle  loaclhost:");
    console.log("FIle  PORT :", config.PORT);

    const baseUrl = `http://${config.LOCALHOST}:${config.PORT}/uploads/`; // Replace with your actual base URL
    console.log(baseUrl);
    const fileUrl = `${baseUrl}${uniqueFileName}`;
    console.log(fileUrl);

    return new StatusCode.OK(fileUrl);
  } catch (error) {
    return new StatusCode.UNKNOWN(error.message);
  }
};

const fileOnlyDelete = async (fileUrl) => {
  try {
    console.log("Original fileUrl:", fileUrl);
    const { pathname } = new URL(fileUrl);
    console.log("Path Name", pathname);
    let filePath = decodeURIComponent(pathname.substring(9)); // Remove leading '/' and decode URI components
    console.log("Decoded filePath:", filePath);

    const fullPath = path.join(__dirname, "../uploads", filePath.replace());
    console.log("Full Path", fullPath);
    // Remove the file
    await fs.unlink(fullPath);
    console.log("File deleted successfully");
    return new StatusCode.OK(null, "File is deleted");
  } catch (error) {
    return new StatusCode.UNKNOWN(error.message);
  }
};

const fileByteToSize = async (bytes) => {
  try {
    const kb = bytes / 1024;
    const mb = kb / 1024;
    let size;

    if (mb >= 1) {
      size = `${mb.toFixed()} MB`;
    } else {
      size = `${kb.toFixed()} KB`;
    }
    return new StatusCode.OK(size);
  } catch (error) {
    return new StatusCode.UNKNOWN(error.message);
  }
};

const checkFilePath = async (fileUrl) => {
  try {
    console.log("Original fileUrl:", fileUrl);
    const { protocol } = new URL(fileUrl);

    if (protocol === "http:" || protocol === "https:") {
      return new StatusCode.OK("Provided path is a URL, not a file path");
    } else {
      return new StatusCode.UNKNOWN("Provided path is not a URL");
    }
  } catch (error) {
    return new StatusCode.UNKNOWN(error.message);
  }
};

module.exports = {
  upload,
  fileDelete,
  fileUpload,
  fileOnlyUpload,
  fileOnlyDelete,
  fileByteToSize,
  checkFilePath,
};
