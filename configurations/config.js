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

define("Google_Client_Id", process.env.Google_Client_Id);
define("Google_Client_Secret", process.env.Google_Client_Secret);
define("REDIRECT_URI", process.env.REDIRECT_URI);

define("PORT", process.env.PORT);
define("JWT_SECRET", process.env.JWT_SECRET);
