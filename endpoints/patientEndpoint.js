const router = require("express").Router();
const Patient = require("../controllers/patientController");

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
    const result = await Patient.patientCreate({ Name, DOB });
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
    const result = await Patient.patientList(req.params.page);
    console.log(result);
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

    const result = await Patient.patientUpdate({ Name, DOB, id });
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
    const result = await Patient.patientDelete(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(error);
  }
});

module.exports = router;
