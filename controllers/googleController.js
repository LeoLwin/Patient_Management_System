const StatusCode = require("../helper/status_code_helper");
const getGoogleProfile = require("../utils/getGoogleProfile");

const googleCallBack = async (code) => {
  try {
    const result = await getGoogleProfile(code);  
    return new StatusCode.OK(result);
  } catch (error) {
    return new StatusCode.UNKNOWN(error.message);
  }
};

module.exports = {
  googleCallBack,
};
