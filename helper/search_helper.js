const StatusCode = require("../helper/status_code_helper");

const getHistory = async (getData, history) => {
  try {
    let resultData = [];
    for (let i = 0; i < getData.data.length; i++) {
      const obj = getData.data[i];
      if (history in obj.data) {
        resultData.push(obj.data);
      }
    }
    if (resultData.length > 0) {
      return new StatusCode.OK(resultData);
    } else {
      return new StatusCode.NOT_FOUND(null);
    }
  } catch (error) {
    return new StatusCode.UNKNOWN(error.message);
  }
};

module.exports = { getHistory };
