const define = (name, value) => {
  Object.defineProperty(exports, name, {
    value: value,
    enumerable: true,
  });
};

require("dotenv").config();

define("HOST", process.env.DB_HOST);
define("USER", process.env.DB_USER);
define("PASSWORD", process.env.DB_PASSWORD);
define("DATABASE", process.env.DB_DATABASE);
define("DB_PORT", process.env.DB_PORT);

define("Google_Client_Id", process.env.Google_Client_Id);
define("Google_Client_Secret", process.env.Google_Client_Secret);
define("REDIRECT_URI", process.env.REDIRECT_URI);

define("LOGIN_PASS", process.env.LOGIN_PASS);
define("LOGIN_UNAUTHORIZE", process.env.LOGIN_UNAUTHORIZE);

define("PORT", process.env.PORT);
define("LOCALHOST", process.env.LOCALHOST);
define("JWT_SECRET", process.env.JWT_SECRET);
define("JWT_For_Lark_Bot", process.env.JWT_For_Lark_Bot);

define("LOGIN_SECRET_KEY", process.env.LOGIN_SECRET_KEY);
define("LOGIN_KEY", process.env.LOGIN_KEY);

define("Lark_App_ID", process.env.Lark_App_ID);
define("Lark_App_Secret", process.env.Lark_App_Secret);
define("Lark_App_Scope", process.env.Lark_App_Scope);
define("Lark_App_State", process.env.Lark_App_State);

define("REDIRECT_URI_UI", process.env.REDIRECT_URI_UI);
