const Mainform = require("../models/main_form_model");
const StatusCode = require("../helper/status_code_helper");

const router = require("express").Router();

router.post("/mainFormCreate", async (req, res) => {
  try {
    const { title, multiple_Entry, description } = req.body;
    if (title == "" || multiple_Entry == "" || description == "") {
      return new StatusCode.INVALID_ARGUMENT(
        "Please provide all required fields"
      );
    }
    const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;
    if (specialCharsRegex.test(title) || specialCharsRegex.test(description)) {
      return new StatusCode.INVALID_ARGUMENT(
        "Name cannot contain special characters"
      );
    }
    const result = await Mainform.mainFormCreate(
      title,
      multiple_Entry,
      description
    );
    res.json(result);
  } catch (error) {
    res.status(error);
  }
});

router.get("/mainFormList/:page", async (req, res) => {
  try {
    if (!req.params) {
      return new StatusCode.INVALID_ARGUMENT("Request Params is empty!");
    }
    if (!req.params.page.match(/^\d+$/)) {
      return new StatusCode.INVALID_ARGUMENT("Invalid page format");
    }
    const result = await Mainform.mainFormList(req.params.page);
    res.json(result);
  } catch (error) {
    res.status(error);
  }
});

router.put("/mainFormUpdate/:id", async (req, res) => {
  try {
    const { title, multiple_Entry, description } = req.body;
    const { id } = req.params;
    if (title == "" || multiple_Entry == "" || description == "") {
      return new StatusCode.INVALID_ARGUMENT(
        "Please provide all required fields"
      );
    }
    const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;
    if (specialCharsRegex.test(title) || specialCharsRegex.test(description)) {
      return new StatusCode.INVALID_ARGUMENT(
        "Data cannot contain special characters"
      );
    }

    if (!req.params.id.match(/^\d+$/)) {
      return new StatusCode.INVALID_ARGUMENT("Invalid id format");
    }
    const result = await Mainform.mainFormUpdate(
      title,
      multiple_Entry,
      description,
      id
    );
    res.json(result);
  } catch (error) {
    res.status(error);
  }
});

router.delete("/mainFormDelete/:id", async (req, res) => {
  try {
    if (!req.params) {
      return new StatusCode.INVALID_ARGUMENT("Request Params is empty!");
    }
    if (!req.params.id.match(/^\d+$/)) {
      return new StatusCode.INVALID_ARGUMENT("Invalid id format");
    }
    const result = await Mainform.mainFormDelete(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(error);
  }
});
module.exports = router;
