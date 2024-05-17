const admin = require("firebase-admin");
const StatusCode = require("../helper/status_code_helper");

const serviceAccount = require("../patientmanagementsystem-129bc-firebase-adminsdk-4ez6l-8da2e6d738.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "patientmanagementsystem-129bc.appspot.com",
});

const bucket = admin.storage().bucket();

const fileUpload = async (file) => {
  try {
    const fileBuffer = file.buffer;
    const originalFileName = file.originalname;
    await bucket.file(originalFileName).save(fileBuffer);
    const [url] = await bucket
      .file(originalFileName)
      .getSignedUrl({ action: "read", expires: "01-01-2030" });
    return new StatusCode.OK(url);
  } catch (error) {
    return new StatusCode.UNKNOWN(error);
  }
};

const filedelete = async (fileUrl) => {
  try {
    console.log(fileUrl);
    const { pathname } = new URL(fileUrl);
    let filePath = decodeURIComponent(pathname.substring(1)); // Remove leading '/' and decode URI components
    const bucketNameIndex = filePath.indexOf("/");
    if (bucketNameIndex !== -1) {
      filePath = filePath.substring(bucketNameIndex + 1);
    }
    // // Create a reference to the file to delete
    const fileRef = bucket.file(filePath);
    // Delete the file
    await fileRef.delete();
    return new StatusCode.OK("File is Deleted");
  } catch (error) {
    console.log(error);
    return new StatusCode.UNKNOWN(error.message);
  }
};

module.exports = { bucket, admin, fileUpload, filedelete };
