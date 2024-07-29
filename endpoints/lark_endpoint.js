const router = require("express").Router();
const StatusCode = require("../helper/status_code_helper");
const config = require("../configurations/config");
const login_helper = require("../helper/login_helper");
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
      const result = await login_helper.loginHelper(id, email, name);
      console.log("AccessToken : ", result.data);
      res.json(result);
    } else {
      res.json(new StatusCode.PERMISSION_DENIED("User don't have access."));
    }
  } catch (error) {
    res.json(new StatusCode.UNKNOWN(error.message));
  }
});

router.get("/testToken", async (req, res) => {
  console.log("Testing for endpoint.");

  try {
    const token = await login_helper.tokenFortest();
    console.log(token);
    res.json(token);
  } catch (error) {
    res.json(error);
  }
});

module.exports = router;
