const StatusCode = require("../helper/status_code_helper");

const getHistory = async (getData, history) => {
  try {
    let resultData = [];
    for (let i = 0; i < getData.data.length; i++) {
      const obj = getData.data[i];
      console.log(obj.data);
      if (history in obj.data) {
        resultData.push(obj.data);
      }
    }
    return new StatusCode.OK(resultData);
  } catch (error) {
    return new StatusCode.UNKNOWN(error.message);
  }
};

module.exports = { getHistory };
