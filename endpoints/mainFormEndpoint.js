const Mainform = require("../controllers/mainFormController");

const router = require("express").Router();

router.post("/mainFormCreate", async (req, res) => {
  try {
    const { title, multipleEntry, description } = req.body;
    if (title == "" || multipleEntry == "" || description == "") {
      return res.status(400).json("Please provide all required fields");
    }
    const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;
    if (specialCharsRegex.test(title) || specialCharsRegex.test(description)) {
      return res.status(400).json("Name cannot contain special characters");
    }
    const result = await Mainform.mainFormCreate({
      title,
      multipleEntry,
      description,
    });
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
    const result = await Mainform.mainFormList(req.params.page);
    console.log(`This is :${result}`);
    res.json(result);
  } catch (error) {
    res.status(error);
  }
});
module.exports = router;
