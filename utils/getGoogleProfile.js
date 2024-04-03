const { default: axios } = require("axios");
const StatusCode = require("../helper/status_code_helper");

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
    return new StatusCode.UNKNOWN(error.message);
  }
};

module.exports = getGoogleProfile;
