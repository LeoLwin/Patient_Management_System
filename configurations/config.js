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

define("LOGIN_SECRET_KEY", process.env.LOGIN_SECRET_KEY);
define("LOGIN_KEY", process.env.LOGIN_KEY);
