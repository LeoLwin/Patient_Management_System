const router = require("express").Router();
const Admin = require("../controllers/adminController");

router.post("/adminCreate", async (req, res) => {
  try {
    const { email, name, password } = req.body;
    if (email == "" || name == "" || password == "") {
      return res.status(400).json("Please provide all required fields");
    }
    if (!email.endsWith("@gmail.com")) {
      return res.status(400).json("Email must end with @gmail.com");
    }
    const result = await Admin.adminCreate({ email, name, password });
    res.json(result);
  } catch (error) {
    res.status(error);
  }
});

router.delete("/adminDelete/:id", async (req, res) => {
  try {
    const result = await Admin.adminDelete(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(error);
  }
});

router.post("/adminLogin", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email == "" || password == "") {
      return res.status(400).json("Please provide all required fields");
    }
    if (!email.endsWith("@gmail.com")) {
      return res.status(400).json("Email must end with @gmail.com");
    }
    const result = await Admin.adminLogin({ email, password });
    res.json(result);
  } catch (error) {
    res.status(error);
  }
});

router.post("/isAdminExit", async (req, res) => {
  try {
    const { email } = req.body;
    if (email == "") {
      return res.status(400).json("Please provide all required fields");
    }
    if (!email.endsWith("@gmail.com")) {
      return res.status(400).json("Email must end with @gmail.com");
    }
    const result = await Admin.isAdminExit({ email });
    res.json(result.data[0].email);
  } catch (error) {
    res.status(error);
  }
});

module.exports = router;
