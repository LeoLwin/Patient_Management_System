const FormData = require("../models/form_data_model");
const StatusCode = require("../helper/status_code_helper");
const Search = require("../helper/search_helper");
const { param, body, validationResult } = require("express-validator");
const { validateToken, admin } = require("../middlewares/middleware");

const router = require("express").Router();

router.post(
  "/formDataCreate",
  validateToken,
  admin,
  [
    body("data")
      .notEmpty()
      .withMessage("data is required")
      .isObject()
      .withMessage("Data must be an Object"),
    body("patient_id")
      .notEmpty()
      .withMessage("Patient_ID is required")
      .isInt({ min: 1 })
      .withMessage("Patient_ID must be a positive integer"),
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
      const { data, patient_id } = req.body;
      const result = await FormData.fromDataCreate(
        JSON.stringify(data),
        patient_id
      );
      res.json(result);
    } catch (error) {
      res.json(new StatusCode.UNKNOWN(error.message));
    }
  }
);

router.get(
  "/formDataList/:page",
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
      const result = await FormData.formDataList(req.params.page);
      res.json(result);
    } catch (error) {
      res.json(new StatusCode.UNKNOWN(error.message));
    }
  }
);

router.put(
  "/formDataUpdate/:id",
  validateToken,
  admin,
  [
    body("data")
      .notEmpty()
      .withMessage("data is required")
      .isObject()
      .withMessage("Data must be an Object"),
    body("patient_id")
      .notEmpty()
      .withMessage("Patient_ID is required")
      .isInt({ min: 1 })
      .withMessage("Patient_ID must be a positive integer"),
    param("id").notEmpty().isInt().withMessage("ID must be integer.").toInt(),
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
      const { data, patient_id } = req.body;
      const { id } = req.params;
      const result = await FormData.formDataUpdate(
        JSON.stringify(data),
        patient_id,
        id
      );
      res.json(result);
    } catch (error) {
      res.json(new StatusCode.UNKNOWN(error.message));
    }
  }
);

router.delete(
  "/formDataDelete/:id",
  validateToken,
  admin,
  [
    param("id").notEmpty().isInt().withMessage("ID must be integer.").toInt(),
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
      const result = await FormData.formDataDelete(req.params.id);
      res.json(result);
    } catch (error) {
      res.json(new StatusCode.UNKNOWN(error.message));
    }
  }
);

router.post(
  "/formDataSearchPatient",
  validateToken,
  admin,
  [
    body("patient_id")
      .notEmpty()
      .withMessage("patient_id is required")
      .trim()
      .escape()
      .custom((value) => {
        // Check if the name contains special characters
        const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;
        if (specialCharsRegex.test(value)) {
          throw new StatusCode.UNKNOWN(
            "Name cannot contain special characters"
          );
        }
        // Return true to indicate validation passed
        return true;
      }),
    body("history")
      .notEmpty()
      .withMessage("Histories is required")
      .trim()
      .escape()
      .custom((value) => {
        // Check if the name contains special characters
        const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;
        if (specialCharsRegex.test(value)) {
          throw new StatusCode.UNKNOWN(
            "Name cannot contain special characters"
          );
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
      const { patient_id, history } = req.body;
      const getData = await FormData.formDataPatientSearch(patient_id);
      if (getData.code == 200) {
        const result = await Search.getHistory(getData, history);
        res.json(result);
      } else {
        res.json(getData);
      }
    } catch (error) {
      res.json(new StatusCode.UNKNOWN(error.message));
    }
  }
);

module.exports = router;
