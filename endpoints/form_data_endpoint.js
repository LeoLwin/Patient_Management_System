const FormData = require("../models/form_data_model");
const StatusCode = require("../helper/status_code_helper");
const { param, body, validationResult } = require("express-validator");

const router = require("express").Router();

router.post(
  "/formDataCreate",
  [
    body("data")
      .notEmpty()
      .withMessage("data is required")
      .isArray()
      .withMessage("Data must be an array"),
    body("patient_id")
      .notEmpty()
      .withMessage("Patient_ID is required")
      .isInt({ min: 1 })
      .withMessage("Patient_ID must be a positive integer"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json(
          new StatusCode.INVALID_ARGUMENT({ errors: errors.array() })
        );
      }

      const { data, patient_id } = req.body;
      const result = await FormData.fromDataCreate(data, patient_id);
      res.json(result);
    } catch (error) {
      res.status(error);
    }
  }
);

router.get(
  "/formDataList/:page",
  [param("page").notEmpty().isInt().toInt()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json(
          new StatusCode.INVALID_ARGUMENT({ errors: errors.array() })
        );
      }
      const result = await FormData.formDataList(req.params.page);
      console.log(result);
      res.json(result);
    } catch (error) {
      res.status(error);
    }
  }
);

router.put(
  "/formDataUpdate/:id",
  [
    body("data")
      .notEmpty()
      .withMessage("data is required")
      .isArray()
      .withMessage("Data must be an object"),
    body("patient_id")
      .notEmpty()
      .withMessage("Patient_ID is required")
      .isInt({ min: 1 })
      .withMessage("Patient_ID must be a positive integer"),
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
      const { data, patient_id } = req.body;
      const { id } = req.params;
      const result = await FormData.formDataUpdate(data, patient_id, id);
      res.json(result);
    } catch (error) {
      res.status(error);
    }
  }
);

router.delete(
  "/formDataDelete/:id",
  [param("id").notEmpty().isInt().toInt()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json(
          new StatusCode.INVALID_ARGUMENT({ errors: errors.array() })
        );
      }
      const result = await FormData.formDataDelete(req.params.id);
      res.json(result);
    } catch (error) {
      res.status(error);
    }
  }
);
module.exports = router;
