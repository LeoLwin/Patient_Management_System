require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
PORT = process.env.PORT || 2000;

app.use(cors());
app.use(express.json());

const patient = require("./endpoints/patientEndpoint");
const login = require("./endpoints/googleLogin");
const admin = require("./endpoints/adminEndpoint");

app.use("/patient", patient);
app.use("/login", login);
app.use("/admin", admin);

app.get("/", (req, res) => {
  res.json({ message: "Patient Management System" });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
