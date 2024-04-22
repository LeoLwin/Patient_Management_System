const router = require("express").Router();
const { result } = require("lodash");
const StatusCode = require("../helper/status_code_helper");
const Partner = require("../models/partner_model");
const { param, body, validationResult } = require("express-validator");

router.post(
  "/partnerCreate",
  [
    body("patient_id_1")
      .notEmpty()
      .withMessage("ID is required")
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
    body("patient_id_2")
      .notEmpty()
      .withMessage("ID is required")
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
    body().custom((value, { req }) => {
      if (req.body.patient_id_1 === req.body.patient_id_2) {
        throw new Error("Patient IDs must be different");
      }
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
      const { patient_id_1, patient_id_2 } = req.body;
      const isExist = await Partner.partnerCheck(patient_id_1, patient_id_2);

      isExist.data.data
        ? res.json(new StatusCode.ALREADY_EXISTS())
        : res.json(await Partner.partnerCreate(patient_id_1, patient_id_2));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.get(
  "/partnerList/:page",
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

      const result = await Partner.partnerList(page);
      res.json(result);
    } catch (error) {
      res.status(error);
    }
  }
);

router.put(
  "/partnertUpdate/:id",
  [
    body("patient_id_1")
      .notEmpty()
      .withMessage("ID is required")
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
    body("patient_id_2")
      .notEmpty()
      .withMessage("ID is required")
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
      const { patient_id_1, patient_id_2 } = req.body;
      const { id } = req.params;
      const result = await Partner.partnerUpdate(
        patient_id_1,
        patient_id_2,
        id
      );
      res.json(result);
    } catch (error) {
      res.status(error);
    }
  }
);

router.delete(
  "/partnerDelete/:id",
  [param("id").notEmpty().isInt().toInt()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json(
          new StatusCode.INVALID_ARGUMENT({ errors: errors.array() })
        );
      }

      const result = await Partner.partnerDelete(req.params.id);
      res.json(result);
    } catch (error) {
      res.status(error);
    }
  }
);

router.post(
  "/partnerSearch",
  [
    body("patient_id")
      .notEmpty()
      .withMessage("ID is required")
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
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json(
          new StatusCode.INVALID_ARGUMENT({ errors: errors.array() })
        );
      }
      const { patient_id } = req.body;
      const result = await Partner.partnerSearch(patient_id);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

//check partner if needed
router.post(
  "/partnerCheck",
  [
    body("patient_id")
      .notEmpty()
      .withMessage("ID is required")
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
    body("partner_id")
      .notEmpty()
      .withMessage("ID is required")
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
    body().custom((value, { req }) => {
      if (req.body.patient_id === req.body.partner_id) {
        throw new Error("Patient IDs must be different");
      }
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
        `http://localhost:3000/patient/patientIdSearch/${id}`;
      }
      const { patient_id, partner_id } = req.body;

      const result = await Partner.partnerCheck(patient_id, partner_id);
      res.json(result.data);
    } catch (error) {
      res.json(error);
    }
  }
);

module.exports = router;
