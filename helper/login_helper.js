const StatusCode = require("./status_code_helper");
const jwt = require("jsonwebtoken");
const config = require("../configurations/config");
const Middleware = require("../middlewares/middleware");

const loginHelper = async (id, email, name) => {
  try {
    const accessToken = jwt.sign(
      {
        user: {
          name: name,
          email: email,
          id: id,
        },
      },
      config.JWT_SECRET,
      { expiresIn: "9h" }
    );
    return new StatusCode.OK(accessToken);
  } catch (error) {
    return new StatusCode.UNKNOWN(error);
  }
};

module.exports = { loginHelper };
