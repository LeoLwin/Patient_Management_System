const router = require("express").Router();
const Patient = require("../models/patient_model");
const StatusCode = require("../helper/status_code_helper");
const { param, body, validationResult } = require("express-validator");
const { values } = require("lodash");

router.post(
  "/patientCreate",
  [
    body("name")
      .notEmpty()
      .withMessage("Name is required")
      .trim()
      .escape()
      .custom((value) => {
        // Check if the name contains special characters
        const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;
        if (specialCharsRegex.test(value)) {
          throw new Error("Name cannot contain special characters");
        }
        // Return true to indicate validation passed
        return true;
      }),
    body("dob")
      .notEmpty()
      .matches(/^\d{4}-\d{2}-\d{2}$/) // Matches format yyyy-mm-dd
      .withMessage("Date of birth must be in yyyymmdd format"),
    body("nrc")
      .notEmpty()
      .matches(/^..\/......\(.\)......$/)
      .withMessage(
        "Invalid format for NRC. It should match the pattern ??/??????(?)??????"
      ),
    body("gender")
      .notEmpty()
      .custom((value) => {
        const validGenders = ["male", "female"];
        if (!validGenders.includes(value.toLowerCase())) {
          throw new Error(
            `Invalid gender. It must be one of: ${validGenders.join(", ")}`
          );
        }
        return true; // Validation passed
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
      const { name, dob, nrc, gender } = req.body;
      const result = await Patient.patientCreate(name, dob, nrc, gender);
      res.json(result);
    } catch (error) {
      res.status(error);
    }
  }
);

router.get(
  "/patientList/:page",
  [param("page").notEmpty().isInt().toInt()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json(
          new StatusCode.INVALID_ARGUMENT({ errors: errors.array() })
        );
      }

      const page = req.params.page;

      const result = await Patient.patientList(page);
      res.json(result);
    } catch (error) {
      res.status(error);
    }
  }
);

router.put(
  "/patientUpdate/:id",
  [
    body("name")
      .notEmpty()
      .withMessage("Name is required")
      .trim()
      .escape()
      .custom((value) => {
        // Check if the name contains special characters
        const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;
        if (specialCharsRegex.test(value)) {
          throw new Error("Name cannot contain special characters");
        }
        // Return true to indicate validation passed
        return true;
      }),
    body("dob")
      .notEmpty()
      .matches(/^\d{4}-\d{2}-\d{2}$/) // Matches format yyyy-mm-dd
      .withMessage("Date of birth must be in yyyymmdd format"),
    body("nrc")
      .notEmpty()
      .matches(/^..\/......\(.\)......$/)
      .withMessage(
        "Invalid format for NRC. It should match the pattern ??/??????(?)??????"
      ),
    body("gender")
      .notEmpty()
      .custom((value) => {
        const validGenders = ["male", "female"];
        if (!validGenders.includes(value.toLowerCase())) {
          throw new Error(
            `Invalid gender. It must be one of: ${validGenders.join(", ")}`
          );
        }
        return true; // Validation passed
      }),
    param("id").notEmpty().isInt().toInt(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json(
          new StatusCode.INVALID_ARGUMENT({ errors: errors.array() })
        );
      }

      const { name, dob, nrc, gender } = req.body;
      const { id } = req.params;

      const result = await Patient.patientUpdate(name, dob, nrc, gender, id);
      res.json(result);
    } catch (error) {
      res.status(error);
    }
  }
);

router.delete(
  "/patientDelete/:id",
  [param("id").notEmpty().isInt().toInt()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json(
          new StatusCode.INVALID_ARGUMENT({ errors: errors.array() })
        );
      }

      const result = await Patient.patientDelete(req.params.id);
      res.json(result);
    } catch (error) {
      res.status(error);
    }
  }
);

router.post(
  "/patientNameSearch",
  [
    body("name")
      .notEmpty()
      .withMessage("Name is required")
      .trim()
      .escape()
      .custom((value) => {
        // Check if the name contains special characters
        const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;
        if (specialCharsRegex.test(value)) {
          throw new Error("Name cannot contain special characters");
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

      const { name } = req.body;
      const result = await Patient.patientNameSearch(name);
      res.json(result);
    } catch (error) {
      res.status(error);
    }
  }
);

router.post(
  "/patientNrcSearch",
  [
    body("nrc")
      .notEmpty()
      .matches(/^..\/......\(.\)......$/)
      .withMessage(
        "Invalid format for NRC. It should match the pattern ??/??????(?)??????"
      ),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json(
          new StatusCode.INVALID_ARGUMENT({ errors: errors.array() })
        );
      }
      const { nrc } = req.body;
      const result = await Patient.patientNrcSearch(nrc);
      res.json(result);
    } catch (error) {
      res.status(error);
    }
  }
);

router.post(
  "/patientIdSearch/:id",
  [param("id").notEmpty().isInt().toInt()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json(
          new StatusCode.INVALID_ARGUMENT({ errors: errors.array() })
        );
      }
      const result = await Patient.patientIdSearch(req.params.id);
      res.json(result);
    } catch (error) {
      res.status(error);
    }
  }
);

module.exports = router;
