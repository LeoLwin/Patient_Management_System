const router = require("express").Router();
const Admin = require("../models/admin_model");
const LoginHelper = require("../helper/login_helper");
const StatusCode = require("../helper/status_code_helper");
const { param, body, validationResult } = require("express-validator");

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
        return res.json(
          new StatusCode.INVALID_ARGUMENT({ errors: errors.array() })
        );
      }
      const { email, name, password } = req.body;

      const result = await Admin.adminCreate(email, name, password);
      res.json(result);
    } catch (error) {
      res.status(error);
    }
  }
);

router.get(
  "/adminList/:page",
  [param("page").notEmpty().isInt().toInt()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json(
          new StatusCode.INVALID_ARGUMENT({ errors: errors.array() })
        );
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
        return res.json(
          new StatusCode.INVALID_ARGUMENT({ errors: errors.array() })
        );
      }
      const result = await Admin.adminDelete(req.params.id);
      res.json(result);
    } catch (error) {
      res.status(error);
    }
  }
);

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
        return res.json(
          new StatusCode.INVALID_ARGUMENT({ errors: errors.array() })
        );
      }
      const { email, password } = req.body;

      const getUser = await Admin.isAdminExist(email);
      const result = await LoginHelper(getUser, password);
      res.json(result);
    } catch (error) {
      res.status(error);
    }
  }
);

router.post(
  "/isAdminExist",
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
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json(
          new StatusCode.INVALID_ARGUMENT({ errors: errors.array() })
        );
      }
      const { email } = req.body;
      const result = await Admin.isAdminExist(email);
      res.json(result.data[0].email);
    } catch (error) {
      res.status(error);
    }
  }
);

module.exports = router;

// router.post("/adminCreate", async (req, res) => {
//   try {
//     const { email, name, password } = req.body;
//     if (email == "" || name == "" || password == "") {
//       return res.json(
//         new StatusCode.INVALID_ARGUMENT("Please provide all required fields")
//       );
//     }

//     const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;
//     if (specialCharsRegex.test(name)) {
//       return res.json(
//         new StatusCode.INVALID_ARGUMENT(
//           "Name cannot contain special characters"
//         )
//       );
//     }
//     if (!email.endsWith("@gmail.com")) {
//       return res.json(
//         new StatusCode.UNAVAILABLE("Email must end with @gmail.com")
//       );
//     }
//     const result = await Admin.adminCreate(email, name, password);
//     res.json(result);
//   } catch (error) {
//     res.status(error);
//   }
// });

// router.get("/adminList/:page", async (req, res) => {
//   try {
//     if (!req.params) {
//       return res.json(
//         new StatusCode.INVALID_ARGUMENT("Request Params is empty!")
//       );
//     }
//     if (!req.params.page.match(/^\d+$/)) {
//       return res.json(new StatusCode.INVALID_ARGUMENT("Invalid id format"));
//     }
//     const result = await Admin.adminList(req.params.page);
//     res.json(result);
//   } catch (error) {
//     res.status(error);
//   }
// });

// router.delete("/adminDelete/:id", async (req, res) => {
//   try {
//     const result = await Admin.adminDelete(req.params.id);
//     if (!req.params.id.match(/^\d+$/)) {
//       return res.status(new StatusCode.INVALID_ARGUMENT("Invalid id format"));
//     }
//     res.json(result);
//   } catch (error) {
//     res.status(error);
//   }
// });

// router.post("/adminLogin", async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     if (email == "" || password == "") {
//       return res.json(
//         new StatusCode.INVALID_ARGUMENT("Please provide all required fields")
//       );
//     }
//     if (!email.endsWith("@gmail.com")) {
//       return res.json(
//         new StatusCode.UNAVAILABLE("Email must end with @gmail.com")
//       );
//     }
//     const getUser = await Admin.isAdminExist(email);
//     const result = await LoginHelper(getUser, password);
//     res.json(result);
//   } catch (error) {
//     res.status(error);
//   }
// });

// router.post("/isAdminExist", async (req, res) => {
//   try {
//     const { email } = req.body;
//     if (email == "") {
//       return res.json(
//         new StatusCode.INVALID_ARGUMENT("Please provide all required fields")
//       );
//     }
//     if (!email.endsWith("@gmail.com")) {
//       return res.json(
//         new StatusCode.UNAVAILABLE("Email must end with @gmail.com")
//       );
//     }
//     const result = await Admin.isAdminExist(email);
//     res.json(result.data[0].email);
//   } catch (error) {
//     res.status(error);
//   }
// });

// module.exports = router;
