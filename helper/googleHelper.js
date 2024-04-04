require("dotenv").config();
const axios = require("axios");
const StatusCode = require("./status_code_helper");

const getURL = async () => {
  try {
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.Google_Client_Id}&redirect_uri=${process.env.REDIRECT_URI}&response_type=code&scope=https://www.googleapis.com/auth/userinfo.profile%20https://www.googleapis.com/auth/userinfo.email`;
    return new StatusCode.OK(url);
  } catch (error) {
    return new StatusCode.UNKNOWN(error);
  }
};

const getGoogleProfile = async (code) => {
  try {
    const { data } = await axios.post("https://oauth2.googleapis.com/token", {
      client_id: process.env.Google_Client_Id,
      client_secret: process.env.Google_Client_Secret,
      code,
      redirect_uri: process.env.REDIRECT_URI,
      grant_type: "authorization_code",
    });
    const { access_token } = data;
    // Use access_token to fetch user profile
    const { data: profile } = await axios.get(
      "https://www.googleapis.com/oauth2/v1/userinfo",
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );
    return new StatusCode.OK(profile);
  } catch (error) {
    return new StatusCode.UNKNOWN(error);
  }
};

module.exports = { getGoogleProfile, getURL };
