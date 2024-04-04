require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const config = require("./configurations/config");
PORT = config.PORT || 2000;

app.use(cors());
app.use(express.json());

const patient = require("./endpoints/patient_endpoint");
const login = require("./endpoints/google_login_endpoint");
const admin = require("./endpoints/admin_endpoint");
const mainForm = require("./endpoints/main_form_endpoint");

app.use("/patient", patient);
app.use("/login", login);
app.use("/admin", admin);
app.use("/mainForm", mainForm);

app.get("/", (req, res) => {
  res.json({ message: "Patient Management System" });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
