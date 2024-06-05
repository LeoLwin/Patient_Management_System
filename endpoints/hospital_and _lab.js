const router = require("express").Router();
const Tag = require("../models/tags_model");
const { param, body, validationResult } = require("express-validator");
const StatusCode = require("../helper/status_code_helper");
const HospAndLab = require("../models/hospital_and_lab");

router.post(
  "/HosAndLabCreate",
  [
    body("patient_id")
      .notEmpty()
      .withMessage("Patinet ID is required")
      .trim()
      .escape()
      .custom((value) => {
        // Check if the value is an integer
        if (!Number.isInteger(Number(value))) {
          throw new Error("ID must be an integer");
        }
        // Check if the name contains special characters
        const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;
        if (specialCharsRegex.test(value)) {
          throw new Error("Name cannot contain special characters");
        }
        // Return true to indicate validation passed
        return true;
      }),
    body("date")
      .notEmpty()
      .matches(/^\d{4}\/\d{2}\/\d{2}$/) // Matches format yyyy/mm/dd
      .withMessage("Date of birth must be in yyyy/mm/dd format"),
    body("location_name")
      .notEmpty()
      .withMessage("location_name is required")
      .trim()
      .escape()
      .custom((value) => {
        // Check if the name contains special characters
        const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;
        if (specialCharsRegex.test(value)) {
          throw new Error("location_name cannot contain special characters");
        }
        // Return true to indicate validation passed
        return true;
      }),
    body("remark")
      .notEmpty()
      .withMessage("Remark is required")
      .trim()
      .escape()
      .custom((value) => {
        // Check if the name contains special characters
        const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;
        if (specialCharsRegex.test(value)) {
          throw new Error("Remark cannot contain special characters");
        }
        // Return true to indicate validation passed
        return true;
      }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json(new StatusCode.INVALID_ARGUMENT(errors.errors[0].msg));
      }
      const { patient_id, date, location_name, remark } = req.body;

      const result = await HospAndLab.hospAndLabCreate(
        patient_id,
        date,
        location_name,
        remark
      );
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
);

router.get(
  "/HosAndLabList/:page",
  [param("page").notEmpty().isInt().toInt()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json(new StatusCode.INVALID_ARGUMENT(errors.errors[0].msg));
      }
      const { page } = req.params;
      const result = await HospAndLab.hospAndLabList(page);
      res.json(result);
    } catch (error) {
      res.status(error);
    }
  }
);

router.put(
  "/HosAndLabUpdate/:id",
  [
    body("patient_id")
      .notEmpty()
      .withMessage("Patinet ID is required")
      .trim()
      .escape()
      .custom((value) => {
        // Check if the value is an integer
        if (!Number.isInteger(Number(value))) {
          throw new Error("ID must be an integer");
        }
        // Check if the name contains special characters
        const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;
        if (specialCharsRegex.test(value)) {
          throw new Error("Name cannot contain special characters");
        }
        // Return true to indicate validation passed
        return true;
      }),
    body("date")
      .notEmpty()
      .matches(/^\d{4}\/\d{2}\/\d{2}$/) // Matches format yyyy/mm/dd
      .withMessage("Date of birth must be in yyyy/mm/dd format"),
    body("location_name")
      .notEmpty()
      .withMessage("location_name is required")
      .trim()
      .escape()
      .custom((value) => {
        // Check if the name contains special characters
        const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;
        if (specialCharsRegex.test(value)) {
          throw new Error("location_name cannot contain special characters");
        }
        // Return true to indicate validation passed
        return true;
      }),
    body("remark")
      .notEmpty()
      .withMessage("Remark is required")
      .trim()
      .escape()
      .custom((value) => {
        // Check if the name contains special characters
        const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;
        if (specialCharsRegex.test(value)) {
          throw new Error("Remark cannot contain special characters");
        }
        // Return true to indicate validation passed
        return true;
      }),
    param("id").notEmpty().isInt().toInt(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json(new StatusCode.INVALID_ARGUMENT(errors));
      }
      const { patient_id, date, location_name, remark } = req.body;
      const { id } = req.params;

      const result = await HospAndLab.hospAndLabUpdate(
        patient_id,
        date,
        location_name,
        remark,
        id
      );

      res.json(result);
    } catch (error) {
      res.status(error);
    }
  }
);

router.delete(
  "/HosAndLabDelete/:id",
  [param("id").notEmpty().isInt().toInt().withMessage("Must Be Number")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json(new StatusCode.INVALID_ARGUMENT(errors.errors[0].msg));
    }

    const { id } = req.params;
    console.log(id);

    const result = await HospAndLab.hospAndLabDelete(id);
    res.json(result);
    try {
    } catch (error) {
      res.status(error);
    }
  }
);

module.exports = router;
