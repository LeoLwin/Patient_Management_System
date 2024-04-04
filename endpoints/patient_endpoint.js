const router = require("express").Router();
const Patient = require("../models/patient_model");

router.post("/patientCreate", async (req, res) => {
  try {
    const { Name, DOB } = req.body;
    if (Name == "" || DOB == "") {
      return res.status(400).json("Please provide all required fields");
    }
    const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;
    if (specialCharsRegex.test(Name) || specialCharsRegex.test(DOB)) {
      return res.status(400).json("Name cannot contain special characters");
    }
    if (!DOB.match(/^\d{8}$/)) {
      return res.status(400).json("Date must be in YYYYMMDD format");
    }
    const result = await Patient.patientCreate(Name, DOB);
    res.json(result);
  } catch (error) {
    res.status(error);
  }
});

router.get("/patientList/:page", async (req, res) => {
  try {
    if (!req.params) {
      return new StatusCode.INVALID_ARGUMENT("Request Params is empty!");
    }
    if (!req.params.page.match(/^\d+$/)) {
      return res.status(400).json("Invalid id format");
    }
    const result = await Patient.patientList(req.params.page);
    res.json(result);
  } catch (error) {
    res.status(error);
  }
});

router.put("/patientUpdate/:id", async (req, res) => {
  try {
    const { Name, DOB } = req.body;
    const { id } = req.params;
    if (Name == "" || DOB == "") {
      return res.status(400).json("Please provide all required fields");
    }
    const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;

    if (specialCharsRegex.test(Name) || specialCharsRegex.test(DOB)) {
      return res.status(400).json("Name cannot contain special characters");
    }

    if (!DOB.match(/^\d{8}$/)) {
      return res.status(400).json("Date must be in YYYYMMDD format");
    }

    if (!req.params.id.match(/^\d+$/)) {
      return res.status(400).json("Invalid id format");
    }

    const result = await Patient.patientUpdate(Name, DOB, id);
    res.json(result);
  } catch (error) {
    res.status(error);
  }
});

router.delete("/patientDelete/:id", async (req, res) => {
  try {
    if (!req.params) {
      return new StatusCode.INVALID_ARGUMENT("Request Params is empty!");
    }
    if (!req.params.id.match(/^\d+$/)) {
      return res.status(400).json("Invalid id format");
    }
    const result = await Patient.patientDelete(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(error);
  }
});

module.exports = router;
