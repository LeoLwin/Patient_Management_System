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

const fileUpload = async (file) => {
  try {
    const uploadFile = file.buffer;

    const uniqueFileName = `${uuidv4()}-${file.originalname}`;
    const uploadDir = path.join(__dirname, "../uploads");
    const filePath = path.join(uploadDir, uniqueFileName);

    // Ensure the directory exists
    await fs.mkdir(uploadDir, { recursive: true });

    // Write the file to the specified directory
    await fs.writeFile(filePath, uploadFile);

    console.log(`File saved to ${filePath}`);

    // Construct the file URL
    const baseUrl = "http://localhost:3000/images/"; // Replace with your actual base URL
    const fileUrl = `${baseUrl}${uniqueFileName}`;

    return new StatusCode.OK(fileUrl);
  } catch (error) {
    console.error(error);
    return new StatusCode.OK(error.message);
  }
};

// const fileUpload = async (fileBuffer, fileName, nrc) => {
//   try {
//     // Sanitize the NRC string to make it a valid folder name
//     const sanitizedNrc = sanitizeFileName(nrc);
//     // Treat the entire NRC as a single directory name
//     const uniqueFileName = `${uuidv4()}-${fileName}`;

//     const uploadDir = path.join(
//       __dirname,
//       "../uploads",
//       "profilePic",
//       sanitizedNrc
//     );
//     const filePath = path.join(uploadDir, uniqueFileName);

//     // Ensure the directory exists
//     if (!fs.existsSync(uploadDir)) {
//       fs.mkdirSync(uploadDir, { recursive: true });
//     }

//     // Write the file to the specified directory
//     fs.writeFileSync(filePath, fileBuffer);

//     // // Get the relative path from the absolute path
//     // const relativePath = path.relative(path.join(__dirname, "../"), filePath);

//     console.log(`File saved to ${filePath}`);
//     return new StatusCode.OK(filePath);
//   } catch (error) {
//     console.error(error);
//     return new StatusCode.UNKNOWN(error.message);
//   }
// };

const fileDelete = async (filePath) => {
  try {
    console.log("filePath :", filePath);
    await fs.remove(filePath, (err) => {
      if (err) return new StatusCode.UNKNOWN(err);
    });
    return new StatusCode.OK(null, "File is deleted");
  } catch (error) {
    console.error(error);
    return new StatusCode.UNKNOWN(error.message);
  }
};

module.exports = { upload, fileDelete, fileUpload };
