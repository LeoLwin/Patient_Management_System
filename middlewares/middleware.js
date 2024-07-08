const StatusCode = require("../helper/status_code_helper");

let loggedInUsers = {};

const authorization = async (req, res, next) => {
  try {
    console.log(req.session);
    if (req.session.loggedin) {
      if (!req.session.uId) {
        req.session = null;
        res.redirect("/login");
        return;
      }

      // if not in loggedInUsers list yet, add the user.
      if (loggedInUsers[req.session.uId] == undefined) {
        loggedInUsers[req.session.uId] = req.session.id;
      }

      if (loggedInUsers[req.session.uId] != req.session.id) {
        // login session available. but replaced by another login.
        req.session = null;
        res.redirect("/login");
        return;
      }

      next();
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    console.log(error);
    res.json(new StatusCode.PERMISSION_DENIED());
  }
};

const saveLoggedInUser = (uId, sessionId) => {
  loggedInUsers[uId] = sessionId;
  console.log(loggedInUsers);
};

const clearLogOutUser = async (uId) => {
  console.log("This is from postman uID :", uId);
  console.log("clearLogOutUser", loggedInUsers);
  for (const key in loggedInUsers) {
    console.log(`${key} : ${loggedInUsers[key]}`);
    if (uId == key) {
      console.log(`This is equal${key} : ${loggedInUsers[key]}`);
      await delete loggedInUsers[key];
    }
  }
  console.log("clearLogOutUser", loggedInUsers);

  // await delete loggedInUsers.uId;
};

module.exports = { authorization, saveLoggedInUser, clearLogOutUser };
