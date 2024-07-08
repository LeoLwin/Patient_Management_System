const router = require("express").Router();
const Admin = require("../models/admin_model");
const LoginHelper = require("../helper/login_helper");
const bcrypt = require("bcrypt");
const StatusCode = require("../helper/status_code_helper");
const { param, body, validationResult } = require("express-validator");
const Middleware = require("../middlewares/middleware");

router.post(
  "/adminCreate",
  [
    body("email")
      .notEmpty()
      .isEmail()
      .normalizeEmail()
      .custom((value) => {
        if (!value.endsWith("@gmail.com")) {
          throw new Error("Email must end with @gmail.com");
        }
        // Return true to indicate validation passed
        return true;
      }),
    body("name")
      .notEmpty()
      .trim()
      .escape()
      .matches(/^[a-zA-Z ]+$/),
    body("password").notEmpty().isLength({ min: 6 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json(new StatusCode.INVALID_ARGUMENT(errors.errors[0].msg));
      }
      console.log(req.body);
      const { email, name, password } = req.body;
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      console.log(hashedPassword);

      const result = await Admin.adminCreate(email, name, hashedPassword);
      res.json(result);
    } catch (error) {
      res.status(error);
    }
  }
);

router.get(
  "/adminList/:page",
  Middleware.authorization,
  [param("page").notEmpty().isInt().toInt()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json(new StatusCode.INVALID_ARGUMENT(errors.errors[0].msg));
      }
      const result = await Admin.adminList(req.params.page);
      res.json(result);
    } catch (error) {
      res.status(error);
    }
  }
);

router.delete(
  "/adminDelete/:id",
  [[param("id").notEmpty().isInt().toInt()]],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json(new StatusCode.INVALID_ARGUMENT(errors.errors[0].msg));
      }
      const result = await Admin.adminDelete(req.params.id);
      res.json(result);
    } catch (error) {
      res.status(error);
    }
  }
);

//Login
router.post(
  "/adminLogin",
  [
    body("email")
      .notEmpty()
      .isEmail()
      .normalizeEmail()
      .custom((value) => {
        if (!value.endsWith("@gmail.com")) {
          throw new Error("Email must end with @gmail.com");
        }
        // Return true to indicate validation passed
        return true;
      }),
    body("password").notEmpty().isLength({ min: 6 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json(new StatusCode.INVALID_ARGUMENT(errors.errors[0].msg));
      }
      const { email, password } = req.body;

      const getUser = await Admin.isAdminExist(email);
      console.log(getUser);
      const result = await LoginHelper.loginHelper(getUser, password, req);

      console.log(req.session.uId);

      if (result.code === "200") {
        res.json(new StatusCode.REDIRECT(`http://localhost:5173/admin`));

        // http://localhost:5173/admin
      } else {
        res.json(result);
      }
    } catch (error) {
      res.status(error);
    }
  }
);

//LogOut
router.delete(
  "/logOut/:uId",
  [param("uId").notEmpty().isInt().toInt()],
  async (req, res) => {
    try {
      const { uId } = req.params;

      console.log(req.session.uId);
      const result = await LoginHelper.logOutHelper(uId, req);
      res.json(result);
    } catch (error) {
      res.status(error);
    }
  }
);

// router.post(
//   "/isAdminExist",
//   [
//     body("email")
//       .notEmpty()
//       .isEmail()
//       .normalizeEmail()
//       .custom((value) => {
//         if (!value.endsWith("@gmail.com")) {
//           throw new Error("Email must end with @gmail.com");
//         }
//         // Return true to indicate validation passed
//         return true;
//       }),
//   ],
//   async (req, res) => {
//     try {
//       const errors = validationResult(req);
//       if (!errors.isEmpty()) {
//         return res.json(new StatusCode.INVALID_ARGUMENT(errors.errors[0].msg));
//       }
//       const { email } = req.body;
//       const result = await Admin.isAdminExist(email);
//       res.json(result);
//     } catch (error) {
//       res.status(error);
//     }
//   }
// );

module.exports = router;
