const router = require("express").Router();
const StatusCode = require("../helper/status_code_helper");
const { validateToken, admin } = require("../middlewares/middleware");
const { param, body, validationResult } = require("express-validator");
const Log = require("../models/logs_models");

router.get(
  "/loglist/:page",
  validateToken,
  admin,
  [
    param("page")
      .notEmpty()
      .isInt()
      .withMessage("Page must be integer.")
      .toInt(),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json(new StatusCode.INVALID_ARGUMENT(errors.errors[0].msg));
      }
      next();
    },
  ],
  async (req, res) => {
    try {
      const page = req.params.page;
      const result = await Log.logList(page);
      res.json(result);
    } catch (error) {
      res.json(new StatusCode.UNKNOWN(error.message));
    }
  }
);

router.get(
  "/listByEmail/:page",
  validateToken,
  admin,
  [
    param("page")
      .notEmpty()
      .isInt()
      .withMessage("Page must be integer.")
      .toInt(),
    body("user_email")
      .notEmpty()
      .withMessage("User_email is required")
      .isEmail()
      .normalizeEmail()
      .custom((value) => {
        if (!value.endsWith("@team.studioamk.com")) {
          throw new Error("Email must end with @team.studioamk.com");
        }
        // Return true to indicate validation passed
        return true;
      }),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json(new StatusCode.INVALID_ARGUMENT(errors.errors[0].msg));
      }
      next();
    },
  ],
  async (req, res) => {
    try {
      const page = req.params.page;
      const result = await Log.logList(page);
      res.json(result);
    } catch (error) {
      res.json(new StatusCode.UNKNOWN(error.message));
    }
  }
);

module.exports = router;
