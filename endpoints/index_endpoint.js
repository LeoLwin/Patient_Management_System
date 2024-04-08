const router = require("express").Router();

const patient = require("./patient_endpoint");
const login = require("./google_login_endpoint");
const admin = require("./admin_endpoint");
const mainForm = require("./main_form_endpoint");
const formData = require("./form_data_endpoint");
const fileUpload = require("./file_upload_endpoint");

router.use("/patient", patient);
router.use("/login", login);
router.use("/admin", admin);
router.use("/mainForm", mainForm);
router.use("/formData", formData);
router.use("/fileUpload", fileUpload);

module.exports = router;
