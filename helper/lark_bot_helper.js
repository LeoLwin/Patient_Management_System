const { Model } = require("firebase-admin/machine-learning");
const StatusCode = require("../helper/status_code_helper");
const config = require("../configurations/config");
const axios = require("axios");

const larkBot = async (email, text) => {
  try {
    const callUrl = `https://dev.ywar.com/larkBot/sendMessage`;
    console.log("Call URL:", callUrl);

    const test = {
      headers: {
        Authorization: "Bearer " + config.JWT_For_Lark_Bot, // Ensure JWT_For_Lark_Bot is defined
        "Content-Type": "application/json",
      },
    };

    const response = await axios.post(callUrl, { email, text }, test); // Sending an empty body
    if (response.data.code !== "200") {
      return new StatusCode.UNKNOWN("Bot not work!");
    }
    return new StatusCode.OK("Send message.");
  } catch (error) {
    return new StatusCode.UNKNOWN(error.message);
  }
};

module.exports = { larkBot };
