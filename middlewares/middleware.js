const jwt = require("jsonwebtoken");
const StatusCode = require("../helper/status_code_helper");
const user = require("../models/admin_model");

const validateToken = async (req, res, next) => {
  try {
    let token;
    let authHeader = req.headers.Authorization || req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer")) {
      token = authHeader.split(" ")[1];
      await jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          console.log(err);
          res.json(new StatusCode.UNAUTHENTICATED("User is not authorized!"));
          return;
        }
        res.locals.user = decoded.user;
        next();
      });
    } else {
      console.log("No Token");
      res.json(
        new StatusCode.UNAUTHENTICATED(
          "User is not authorized or token is missing!"
        )
      );
      return;
    }
  } catch (err) {
    return new StatusCode.UNKNOWN(err);
  }
};

const admin = async (req, res, next) => {
  try {
    console.log("req.locals :37", res.locals);
    const data = await user.userRole(res.locals.user.email);

    if (data.code !== "200") {
      res.json("Your email does not exist!.");
    }
    if (data.data.role !== "Admin") {
      console.log("You are not allowed!");
      res.json(new StatusCode.PERMISSION_DENIED("You are not allowed!"));
      return;
    }
    console.log(data.data);
    console.log("Allow user");
    next();
  } catch (error) {
    console.log(error);
    return res.json(new StatusCode.UNKNOWN(error));
  }
};

module.exports = { validateToken, admin };
