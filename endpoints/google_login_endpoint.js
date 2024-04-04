require("dotenv").config();
const router = require("express").Router();
const GoogleHelper = require("../helper/google_helper");

router.get("/googleLogin", async (req, res) => {
  try {
    const url = await GoogleHelper.getURL();
    res.json(url);
  } catch (error) {
    console.error("Error in Google login:", error);
    throw error;
  }
});

router.get("/auth/google/callback", async (req, res) => {
  try {
    const result = await GoogleHelper.getGoogleProfile(req.query.code);
    res.json(result);
  } catch (error) {
    console.error("Error in Google login:", error);
    throw error;
  }
});

module.exports = router;
