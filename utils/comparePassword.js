const StatusCode = require("../helper/status_code_helper");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const comparePassword = async (data) => {
  try {
    const { getUser, password } = data;
    if (await bcrypt.compareSync(password, getUser.data[0].password)) {
      const accessToken = jwt.sign(
        {
          user: {
            name: getUser.data[0].name,
            email: getUser.data[0].email,
            id: getUser.data[0].id,
          },
        },
        process.env.JWT_SECRET,
        { expiresIn: "2h" }
      );
      return new StatusCode.OK(accessToken);
    }

    return new StatusCode.PERMISSION_DENIED();
  } catch (error) {
    return new StatusCode.UNKNOWN(error);
  }
};

module.exports = comparePassword;
