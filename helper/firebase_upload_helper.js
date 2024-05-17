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

module.exports = { bucket, admin, fileUpload };
