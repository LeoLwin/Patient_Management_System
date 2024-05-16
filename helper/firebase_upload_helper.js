var admin = require("firebase-admin");

var serviceAccount = require("../patientmanagementsystem-129bc-firebase-adminsdk-4ez6l-4c082c9e93.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "patientmanagementsystem-129bc.appspot.com",
});

const bucket = admin.storage().bucket();

module.exports = { bucket };
