require("dotenv").config();
const router = require("express").Router();
const { googleCallBack } = require("../controllers/googleController");

router.get("/googleLogin", (req, res) => {
  try {
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.Google_Client_Id}&redirect_uri=${process.env.REDIRECT_URI}&response_type=code&scope=https://www.googleapis.com/auth/userinfo.profile%20https://www.googleapis.com/auth/userinfo.email`;
    res.json(url);
  } catch (error) {
    console.error("Error in Google login:", error);
    throw error;
  }
});

router.get("/auth/google/callback", async (req, res) => {
  try {
    console.log();
    const result = await googleCallBack(req.query.code);
    res.json(result);
  } catch (error) {
    console.error("Error in Google login:", error);
    throw error;
  }
});

module.exports = router;
