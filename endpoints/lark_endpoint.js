const router = require("express").Router();
const StatusCode = require("../helper/status_code_helper");
const config = require("../configurations/config");
const login_helper = require("../helper/login_helper");
const admin = require("../models/admin_model");
const axios = require("axios");

const allowedEmail = [
  "hlaing.min.aung@team.studioamk.com",
  "nyi.nyi@studioamk.com",
  "ammk@team.studioamk.com",
  "kaung.htet.lwin@team.studioamk.com",
  "myo.myat.zaw@team.studioamk.com",
];

router.get("/login", (req, res) => {
  try {
    console.log("Redirect URI:", config.REDIRECT_URI);
    console.log("Lark App ID:", config.Lark_App_ID);

    const url = `https://open.larksuite.com/open-apis/authen/v1/authorize?app_id=${
      config.Lark_App_ID
    }&redirect_uri=${encodeURIComponent(config.REDIRECT_URI)}&scope=${
      config.Lark_App_Scope
    }&state=${config.Lark_App_State}`;

    res.redirect(
      `https://open.larksuite.com/open-apis/authen/v1/authorize?app_id=${
        config.Lark_App_ID
      }&redirect_uri=${encodeURIComponent(config.REDIRECT_URI)}&scope=${
        config.Lark_App_Scope
      }&state=${config.Lark_App_State}`
    );
    // res.redirect(
    //   `https://open.larksuite.com/open-apis/authen/v1/authorize?app_id=${config.Lark_App_ID}`
    // );
    // return res.json(new StatusCode.OK({ url }));
  } catch (error) {
    res.json(new StatusCode.UNKNOWN(error.message));
  }
});

router.get("/callback", async (req, res) => {
  console.log("40", config.Lark_App_ID);
  console.log("41", config.Lark_App_Secret);
  try {
    const code = req.query.code;
    const larkHost = "https://open.larksuite.com";
    const userAccessTokenUrl = larkHost + "/open-apis/authen/v1/access_token";
    const appAccessTokenUrl =
      larkHost + "/open-apis/auth/v3/app_access_token/internal";
    const userInfoUrl = larkHost + "/open-apis/authen/v1/user_info";

    const appAccessResult = await axios.post(appAccessTokenUrl, {
      app_id: config.Lark_App_ID,
      app_secret: config.Lark_App_Secret,
    });

    if (appAccessResult.data.msg !== "ok") {
      res.send(new StatusCode.UNKNOWN());
      return;
    }
    console.log("appAccessResult", appAccessResult.data);
    const appAccessToken = appAccessResult.data.app_access_token;

    let configAxiosForUserAccess = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + appAccessToken,
      },
    };
    let userAccessData = { grant_type: "authorization_code", code: code };
    const userAccessTokenResult = await axios.post(
      userAccessTokenUrl,
      userAccessData,
      configAxiosForUserAccess
    );

    console.log("userAccessTokenResult", userAccessTokenResult.data);
    if (userAccessTokenResult.data.msg !== "success") {
      res.send(new StatusCode.UNKNOWN());
      return;
    }
    const userAccessToken = userAccessTokenResult.data.data.access_token;

    let configAxiosForUserInfo = {
      headers: {
        Authorization: "Bearer " + userAccessToken,
        "Content-Type": "application/json",
      },
    };

    const userInfoResult = await axios.get(userInfoUrl, configAxiosForUserInfo);
    console.log(userInfoResult.data);

    const userInfo = userInfoResult.data.data;

    let id = userInfo.open_id;
    let email = userInfo.email;
    let name = userInfo.name;

    const found = allowedEmail.includes(email);
    if (found) {
      const getUserID = await admin.emailSearch(email);
      console.log("105", getUserID);
      console.log("106", getUserID.data);
      const result = await login_helper.loginHelper(
        getUserID.data.id,
        email,
        name
      );
      console.log("AccessToken : ", result.data);
      res.json(result);
    } else {
      res.json(new StatusCode.PERMISSION_DENIED("User don't have access."));
    }
  } catch (error) {
    res.json(new StatusCode.UNKNOWN(error.message));
  }
});

router.get("/testToken", async (req, res) => {git
  console.log("Testing for endpoint.");
  try {
    const token = await login_helper.tokenFortest();
    console.log(token);
    res.json(token);
    // res.json(new StatusCode.UNAUTHENTICATED());
  } catch (error) {
    res.json(error);
  }
});

router.get("/larkBot", async (req, res) => {
  try {
    const email = "kaung.htet.lwin@team.studioamk.com";
    // const email = "phoekaung.3819@gmail.com";

    const text = "hello hello";

    // Construct the URL
    const callUrl = `https://dev.ywar.com/larkBot/sendMessage`;
    console.log("Call URL:", callUrl);

    const test = {
      headers: {
        Authorization: "Bearer " + config.JWT_For_Lark_Bot, // Ensure JWT_For_Lark_Bot is defined
        "Content-Type": "application/json",
      },
    };

    // Make the POST request
    const response = await axios.post(callUrl, { email, text }, test); // Sending an empty body

    // Log and send the response
    console.log("Response:", response.data);
  } catch (error) {
    console.error("Error occurred:", error);
    res.json(new StatusCode.UNKNOWN(error.message));
  }
});

module.exports = router;
