const router = require("express").Router();
const Patient = require("../models/patient_model");
const StatusCode = require("../helper/status_code_helper");

router.post("/patientCreate", async (req, res) => {
  try {
    const { name, dob, nrc } = req.body;
    if (name == "" || dob == "" || nrc == "") {
      return res.json(
        new StatusCode.INVALID_ARGUMENT("Please provide all required fields")
      );
    }
    const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;
    if (specialCharsRegex.test(name) || specialCharsRegex.test(dob)) {
      return res.json(
        new StatusCode.INVALID_ARGUMENT(
          "Name cannot contain special characters"
        )
      );
    }
    if (!/^..\/......\(.\)......$/.test(nrc)) {
      return res.json(
        new StatusCode.INVALID_ARGUMENT(
          "Invalid format for NRC. It should match the pattern ??/??????(?)??????"
        )
      );
    }

    if (!dob.match(/^\d{8}$/)) {
      return res.json(
        new StatusCode.INVALID_ARGUMENT("Date must be in YYYYMMDD format")
      );
    }
    const result = await Patient.patientCreate(name, dob, nrc);
    res.json(result);
  } catch (error) {
    res.status(error);
  }
});

router.get("/patientList/:page", async (req, res) => {
  try {
    if (!req.params) {
      return res.json(
        new StatusCode.INVALID_ARGUMENT("Request Params is empty!")
      );
    }
    if (!req.params.page.match(/^\d+$/)) {
      return res.json(new StatusCode.INVALID_ARGUMENT("Invalid id format"));
    }
    const result = await Patient.patientList(req.params.page);
    res.json(result);
  } catch (error) {
    res.status(error);
  }
});

router.put("/patientUpdate/:id", async (req, res) => {
  try {
    const { name, dob, nrc } = req.body;
    const { id } = req.params;
    if (name == "" || dob == "" || nrc == "") {
      return res.json(
        new StatusCode.INVALID_ARGUMENT("Please provide all required fields")
      );
    }
    const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;
    if (specialCharsRegex.test(name) || specialCharsRegex.test(dob)) {
      return res.json(
        new StatusCode.INVALID_ARGUMENT(
          "Name cannot contain special characters"
        )
      );
    }
    if (!/^..\/......\(.\)......$/.test(nrc)) {
      return res.json(
        new StatusCode.INVALID_ARGUMENT(
          "Invalid format for NRC. It should match the pattern ??/??????(?)??????"
        )
      );
    }

    if (!req.params.id.match(/^\d+$/)) {
      return res.json(new StatusCode.INVALID_ARGUMENT("Invalid id format"));
    }

    const result = await Patient.patientUpdate(name, dob, nrc, id);
    res.json(result);
  } catch (error) {
    res.status(error);
  }
});

router.delete("/patientDelete/:id", async (req, res) => {
  try {
    if (!req.params) {
      return res.json(
        new StatusCode.INVALID_ARGUMENT("Request Params is empty!")
      );
    }
    if (!req.params.id.match(/^\d+$/)) {
      return res.json(new StatusCode.INVALID_ARGUMENT("Invalid id format"));
    }
    const result = await Patient.patientDelete(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(error);
  }
});

router.post("/patientNameSearch", async (req, res) => {
  try {
    const { Name } = req.body;
    if (Name == "") {
      return res.json(
        new StatusCode.INVALID_ARGUMENT("Please provide all required fields")
      );
    }
    const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;
    if (specialCharsRegex.test(Name)) {
      return res.json(
        new StatusCode.INVALID_ARGUMENT(
          "Name cannot contain special characters"
        )
      );
    }
    const result = await Patient.patientNameSearch(Name);
    res.json(result);
  } catch (error) {
    res.status(error);
  }
});

module.exports = router;
