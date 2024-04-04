const StatusCode = require("./status_code_helper");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../configurations/config");

const loginHelper = async (getUser, password) => {
  try {
    if (await bcrypt.compareSync(password, getUser.data[0].password)) {
      const accessToken = jwt.sign(
        {
          user: {
            name: getUser.data[0].name,
            email: getUser.data[0].email,
            id: getUser.data[0].id,
          },
        },
        config.JWT_SECRET,
        { expiresIn: "2h" }
      );
      return new StatusCode.OK(accessToken);
    }

    return new StatusCode.PERMISSION_DENIED();
  } catch (error) {
    return new StatusCode.UNKNOWN(error);
  }
};

module.exports = loginHelper;
