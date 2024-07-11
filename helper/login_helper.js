const StatusCode = require("./status_code_helper");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../configurations/config");
const Middleware = require("../middlewares/middleware");

const loginHelper = async (getUser, password, req) => {
  try {
    const user = getUser.data[0];
    if (!user) {
      return new StatusCode.PERMISSION_DENIED();
    }

    console.log(await bcrypt.compare(password, getUser.data[0].password));
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      console.log("Not equal");
      return new StatusCode.PERMISSION_DENIED("Wrong password!");
    }

    req.session.loggedin = true;
    req.session.uId = getUser.data[0].id;
    // req.session.name = getUser.data[0].name;
    // req.session.email = getUser.data[0].email;
    await Middleware.saveLoggedInUser(req.session.uId, req.session.id);

    return new StatusCode.OK(req.session);
  } catch (error) {
    return new StatusCode.UNKNOWN(error);
  }
};

const logOutHelper = async (uId, req) => {
  try {
    console.log("This is from postman uID :", uId);
    console.log("req.session.loggedin :", req.session.loggedin);
    req.session.loggedin = false;

    await Middleware.clearLogOutUser(uId);

    await delete req.session.uId;

    return new StatusCode.OK("Bye Bye!");
  } catch (error) {
    return new StatusCode.UNKNOWN(error);
  }
};

module.exports = { loginHelper, logOutHelper };

// const loginHelper0 = async (getUser, password) => {
//   try {
//     if (await bcrypt.compareSync(password, getUser.data[0].password)) {
//       const accessToken = jwt.sign(
//         {
//           user: {
//             name: getUser.data[0].name,
//             email: getUser.data[0].email,
//             id: getUser.data[0].id,
//           },
//         },
//         config.JWT_SECRET,
//         { expiresIn: "9h" }
//       );
//       return new StatusCode.OK(accessToken);
//     }

//     return new StatusCode.PERMISSION_DENIED();
//   } catch (error) {
//     return new StatusCode.UNKNOWN(error);
//   }
// };
