const router = require("express").Router();

const patientController = require("./patient_endpoint");
const authContoller = require("./google_login_endpoint");
const adminController = require("./admin_endpoint");
const formDataController = require("./form_data_endpoint");
const fileUpload = require("./file_upload_endpoint");
const partner = require("./partner_endpoint");
const HospAndLab = require("./hospital_and _lab");
const followUp = require("./follow_up_endpoint");
const file = require("./file_upload_endpoint");

router.use("/patient", patientController);
router.use("/login", authContoller);
router.use("/admin", adminController);
router.use("/formData", formDataController);
router.use("/fileUpload", fileUpload);
router.use("/partner", partner);
router.use("/hospAndLab", HospAndLab);
router.use("/followUp", followUp);
router.use("/file", file);

module.exports = router;
