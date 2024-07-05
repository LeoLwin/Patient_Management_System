const StatusCode = require("./status_code_helper");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../configurations/config");
const session = require("express-session");

const loginHelper0 = async (getUser, password) => {
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
        { expiresIn: "9h" }
      );
      return new StatusCode.OK(accessToken);
    }

    return new StatusCode.PERMISSION_DENIED();
  } catch (error) {
    return new StatusCode.UNKNOWN(error);
  }
};

const loginHelper = async (getUser, password) => {
  try {
    console.log(getUser.data[0].password, password);
    console.log(await bcrypt.compare(password, getUser.data[0].password));
    console.log(session);
    if (await bcrypt.compareSync(password, getUser.data[0].password)) {
      session.user = {
        id: getUser._id,
        name: getUser.name,
        email: getUser.email,
      };

      return new StatusCode.OK("Session ID :", session.ID);
    }
    return new StatusCode.PERMISSION_DENIED();
  } catch (error) {
    return new StatusCode.UNKNOWN(error);
  }
};

module.exports = loginHelper;
