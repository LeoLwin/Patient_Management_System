const router = require("express").Router();
const Patient = require("../models/patient_model");
const StatusCode = require("../helper/status_code_helper");

router.post("/patientCreate", async (req, res) => {
  try {
    const { Name, DOB } = req.body;
    if (Name == "" || DOB == "") {
      return res.json(
        new StatusCode.INVALID_ARGUMENT("Please provide all required fields")
      );
    }
    const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;
    if (specialCharsRegex.test(Name) || specialCharsRegex.test(DOB)) {
      return res.json(
        new StatusCode.INVALID_ARGUMENT(
          "Name cannot contain special characters"
        )
      );
    }
    if (!DOB.match(/^\d{8}$/)) {
      return res.json(
        new StatusCode.INVALID_ARGUMENT("Date must be in YYYYMMDD format")
      );
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
    const { Name, DOB } = req.body;
    const { id } = req.params;
    if (Name == "" || DOB == "") {
      return res.json(
        new StatusCode.INVALID_ARGUMENT("Please provide all required fields")
      );
    }
    const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;

    if (specialCharsRegex.test(Name) || specialCharsRegex.test(DOB)) {
      return res.json(
        new StatusCode.INVALID_ARGUMENT(
          "Name cannot contain special characters"
        )
      );
    }

    if (!DOB.match(/^\d{8}$/)) {
      return res.json(
        new StatusCode.INVALID_ARGUMENT("Date must be in YYYYMMDD format")
      );
    }

    if (!req.params.id.match(/^\d+$/)) {
      return res.json(new StatusCode.INVALID_ARGUMENT("Invalid id format"));
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
