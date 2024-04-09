const FormData = require("../models/form_data_model");
const StatusCode = require("../helper/status_code_helper");
const Search = require("../helper/search_helper");
const { param, body, validationResult } = require("express-validator");

const router = require("express").Router();

router.post(
  "/formDataCreate",
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
      console.log(req.body);
      const result = await FormData.fromDataCreate(
        JSON.stringify(data),
        patient_id
      );
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
      .isObject()
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
      const result = await FormData.formDataUpdate(
        JSON.stringify(data),
        patient_id,
        id
      );
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

router.post(
  "/formDataSearchPatient",
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
          throw new Error("Name cannot contain special characters");
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

      const { patient_id, history } = req.body;
      console.log(req.body);
      const getData = await FormData.formDataPatientSearch(patient_id);
      const result = await Search.getHistory(getData, history);
      res.json(result);
    } catch (error) {
      res.status(error);
    }
  }
);

// router.post(
//   "/formDataDetail/:id",
//   [param("id").notEmpty().isInt().toInt()],
//   async (req, res) => {
//     try {
//       const errors = validationResult(req);
//       if (!errors.isEmpty()) {
//         return res.json(
//           new StatusCode.INVALID_ARGUMENT({ errors: errors.array() })
//         );
//       }
//       const { id } = req.params;
//       const result = await FormData.formDataDetail(id);
//       res.json(result);
//     } catch (error) {
//       res.status(error);
//     }
//   }
// );

module.exports = router;
