const router = require("express").Router();
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
    // body("remark")
    //   .notEmpty()
    //   .withMessage("Remark is required")
    //   .trim()
    //   .escape()
    //   .custom((value) => {
    //     // Check if the name contains special characters
    //     const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;
    //     if (specialCharsRegex.test(value)) {
    //       throw new Error("Remark cannot contain special characters");
    //     }
    //     // Return true to indicate validation passed
    //     return true;
    //   }),
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

//include page and page_size
router.get(
  "/HosAndLabList/:page",
  [
    body("page_size")
      .notEmpty()
      .withMessage("Page_size ID is required")
      .trim()
      .escape()
      .custom((value) => {
        // Check if the value is an integer
        if (!Number.isInteger(Number(value))) {
          throw new Error("Page_size must be an integer");
        }
        // Check if the name contains special characters
        const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;
        if (specialCharsRegex.test(value)) {
          throw new Error("Page_size cannot contain special characters");
        }
        // Return true to indicate validation passed
        return true;
      }),
    param("page").notEmpty().isInt().toInt(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json(new StatusCode.INVALID_ARGUMENT(errors.errors[0].msg));
      }

      const { page_size } = req.body;
      const { page } = req.params;
      const result = await HospAndLab.hospAndLabList(page, page_size);
      res.json(result);
    } catch (error) {
      res.status(error);
    }
  }
);

//does not include page and page_size
router.get("/HosAndLabOnlyList", async (req, res) => {
  try {
    const result = await HospAndLab.hospAndLabOnlyList();
    res.json(result);
  } catch (error) {
    res.status(error);
  }
});

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
    // body("remark")
    //   .notEmpty()
    //   .withMessage("Remark is required")
    //   .trim()
    //   .escape()
    //   .custom((value) => {
    //     // Check if the name contains special characters
    //     const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;
    //     if (specialCharsRegex.test(value)) {
    //       throw new Error("Remark cannot contain special characters");
    //     }
    //     // Return true to indicate validation passed
    //     return true;
    //   }),
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

//get with patient_id
router.post(
  "/HosAndLabPatientIdSearch",
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
        return res.json(new StatusCode.INVALID_ARGUMENT(errors.errors[0].msg));
      }
      const patient_id = req.body.patient_id;
      const result = await HospAndLab.hospAndLabPatientIdSearch(patient_id);
      res.json(result);
    } catch (error) {
      res.status(error);
    }
  }
);

// Id Search
router.get(
  "/HosAndLabIdSearch/:id",
  [param("id").notEmpty().isInt().toInt()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json(new StatusCode.INVALID_ARGUMENT(errors.errors[0].msg));
      }
      const id = req.params.id;
      const result = await HospAndLab.hospAndLabIdSearch(id);
      res.json(result);
    } catch (error) {
      res.status(error);
    }
  }
);

//from date to date search
router.post(
  "/HosAndLabDateSearch",
  [
    body("start_date")
      .notEmpty()
      .withMessage("Start_Date is required")
      .matches(/^\d{4}\/\d{2}\/\d{2}$/) // Matches format yyyy/mm/dd
      .withMessage("Start_Date  must be in yyyy/mm/dd format"),
  ],
  body("end_date")
    .notEmpty()
    .withMessage("End_Date is required")
    .matches(/^\d{4}\/\d{2}\/\d{2}$/) // Matches format yyyy/mm/dd
    .withMessage("End_Date must be in yyyy/mm/dd format"),
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
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json(new StatusCode.INVALID_ARGUMENT(errors.errors[0].msg));
      }
      const { start_date, end_date, location_name } = req.body;
      console.log(req.body);

      const formattedStartDate = start_date.split("/").join("-");
      const formattedEndDate = end_date.split("/").join("-");

      const result = await HospAndLab.hospAndLabDateSearch(
        formattedStartDate,
        formattedEndDate,
        location_name
      );
      return res.json(result);
    } catch (error) {
      res.status(error);
    }
  }
);

module.exports = router;
