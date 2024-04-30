const Mainform = require("../models/main_form_model");
const StatusCode = require("../helper/status_code_helper");
const { param, body, validationResult } = require("express-validator");

const router = require("express").Router();

router.post(
  "/mainFormCreate",
  [
    body("title")
      .notEmpty()
      .withMessage("Title is required")
      .isString()
      .withMessage("Title must be a string")
      .custom((value) => !/[!@#$%^&*(),.?":{}|<>]/.test(value))
      .withMessage("Title cannot contain special characters"),

    body("multiple_Entry")
      .notEmpty()
      .withMessage("Multiple Entry is required")
      .isBoolean()
      .withMessage("Multiple Entry must be a boolean"),

    body("description")
      .notEmpty()
      .withMessage("Description is required")
      .isString()
      .withMessage("Description must be a string")
      .custom((value) => !/[!@#$%^&*(),.?":{}|<>]/.test(value))
      .withMessage("Description cannot contain special characters"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json(new StatusCode.INVALID_ARGUMENT(errors.errors[0].msg));
      }

      const { title, multiple_Entry, description } = req.body;

      const result = await Mainform.mainFormCreate(
        title,
        multiple_Entry,
        description
      );
      res.json(result);
    } catch (error) {
      res.status(error);
    }
  }
);

router.get(
  "/mainFormList/:page",
  [param("page").notEmpty().isInt().toInt()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json(new StatusCode.INVALID_ARGUMENT(errors.errors[0].msg));
      }
      const result = await Mainform.mainFormList(req.params.page);
      res.json(result);
    } catch (error) {
      res.status(error);
    }
  }
);

router.put(
  "/mainFormUpdate/:id",
  [
    body("title")
      .notEmpty()
      .withMessage("Title is required")
      .isString()
      .withMessage("Title must be a string")
      .custom((value) => !/[!@#$%^&*(),.?":{}|<>]/.test(value))
      .withMessage("Title cannot contain special characters"),

    body("multiple_Entry")
      .notEmpty()
      .withMessage("Multiple Entry is required")
      .isBoolean()
      .withMessage("Multiple Entry must be a boolean"),

    body("description")
      .notEmpty()
      .withMessage("Description is required")
      .isString()
      .withMessage("Description must be a string")
      .custom((value) => !/[!@#$%^&*(),.?":{}|<>]/.test(value))
      .withMessage("Description cannot contain special characters"),
    param("id").notEmpty().isInt().toInt(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json(new StatusCode.INVALID_ARGUMENT(errors.errors[0].msg));
      }
      const { title, multiple_Entry, description } = req.body;
      const { id } = req.params;
      const result = await Mainform.mainFormUpdate(
        title,
        multiple_Entry,
        description,
        id
      );
      res.json(result);
    } catch (error) {
      res.status(error);
    }
  }
);

router.delete(
  "/mainFormDelete/:id",
  [param("id").notEmpty().isInt().toInt()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json(new StatusCode.INVALID_ARGUMENT(errors.errors[0].msg));
      }
      const result = await Mainform.mainFormDelete(req.params.id);
      res.json(result);
    } catch (error) {
      res.status(error);
    }
  }
);
module.exports = router;
