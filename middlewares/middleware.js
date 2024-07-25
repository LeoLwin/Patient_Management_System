const jwt = require("jsonwebtoken");
const StatusCode = require("../helper/status_code_helper");

const validateToken = async (req, res, next) => {
  try {
    let token;
    let authHeader = req.headers.Authorization || req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer")) {
      token = authHeader.split(" ")[1];
      await jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          new StatusCode.UNAUTHENTICATED("User is not authorized!");
          return;
        }
        req.user = decoded.user;
        next();
      });
    } else {
      new StatusCode.UNAUTHENTICATED(
        "User is not authorized or token is missing!"
      );
      return;
    }
  } catch (err) {
    return new StatusCode.UNKNOWN(err);
  }
};

module.exports = validateToken;

// Function to retrieve a cookie by name
// function getCookie(name) {
//   const cookieValue = document.cookie.match(
//     "(^|;)\\s*" + name + "\\s*=\\s*([^;]+)"
//   );
//   return cookieValue ? cookieValue.pop() : "";
// }

// Example usage:

// const authorization = async (req, res, next) => {
//   try {
//     console.log("Testing for for", req.session);
//     if (req.session.loggedin) {
//       if (!req.session.uId) {
//         req.session = null;
//         // res.redirect("/login");
//         res.json(
//           new StatusCode.PERMISSION_DENIED("Permission Denied For sesion null")
//         );
//         return;
//       }

//       // if not in loggedInUsers list yet, add the user.
//       if (loggedInUsers[req.session.uId] == undefined) {
//         loggedInUsers[req.session.uId] = req.session.id;
//       }

//       if (loggedInUsers[req.session.uId] != req.session.id) {
//         console.log("session id is not equal UID ");
//         // login session available. but replaced by another login.
//         req.session = null;
//         // res.redirect("/login");
//         res.json(
//           new StatusCode.PERMISSION_DENIED(
//             "Permission Denied for session id is not equal UID"
//           )
//         );

//         return;
//       }

//       next();
//     } else {
//       res.json(
//         new StatusCode.PERMISSION_DENIED(
//           "Permission Denied for session.loggedin false"
//         )
//       );

//       // res.redirect("/login");
//     }
//   } catch (error) {
//     console.log(error);
//     res.json(new StatusCode.PERMISSION_DENIED());
//   }
// };

// const saveLoggedInUser = (uId, sessionId) => {
//   loggedInUsers[uId] = sessionId;
//   console.log(loggedInUsers);
// };

// const clearLogOutUser = async (uId) => {
//   console.log("This is from postman uID :", uId);
//   console.log("clearLogOutUser", loggedInUsers);
//   for (const key in loggedInUsers) {
//     console.log(`${key} : ${loggedInUsers[key]}`);
//     if (uId == key) {
//       console.log(`This is equal${key} : ${loggedInUsers[key]}`);
//       await delete loggedInUsers[key];
//     }
//   }
//   console.log("clearLogOutUser", loggedInUsers);

//   // await delete loggedInUsers.uId;
// };

// module.exports = { authorization, saveLoggedInUser, clearLogOutUser };
