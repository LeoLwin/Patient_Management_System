const router = require("express").Router();

const patient = require("./patient_endpoint");
const login = require("./google_login_endpoint");
const admin = require("./admin_endpoint");
const mainForm = require("./main_form_endpoint");

router.use("/patient", patient);
router.use("/login", login);
router.use("/admin", admin);
router.use("/mainForm", mainForm);

module.exports = router;
