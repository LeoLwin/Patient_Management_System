const router = require("express").Router();
const { param, body, validationResult } = require("express-validator");
const followUp = require("../models/followUp_model");
const StatusCode = require("../helper/status_code_helper");

router.post(
  "/followUpCreate",
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
    body("date_time")
      .notEmpty()
      .matches(/^\d{4}\/\d{2}\/\d{2} \d{2}:\d{2} (AM|PM)$/i) // Matches format yyyy/mm/dd hh:mm
      .withMessage("Date and time must be in yyyy/mm/dd hh:mm format"),
    body("category")
      .notEmpty()
      .withMessage("Category is required")
      .trim()
      .escape()
      .custom((value) => {
        // Check if the name contains special characters
        const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;
        if (specialCharsRegex.test(value)) {
          throw new Error("Category cannot contain special characters");
        }
        // Return true to indicate validation passed
        return true;
      }),
    // body("remark").custom((value) => {
    //   // Check if the name contains special characters
    //   const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;
    //   if (specialCharsRegex.test(value)) {
    //     throw new Error("Remark cannot contain special characters");
    //   }
    //   // Return true to indicate validation passed
    //   return true;
    // }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json(new StatusCode.INVALID_ARGUMENT(errors.errors[0].msg));
      }
      const { patient_id, date_time, category, remark } = req.body;

      const result = await followUp.followUpCreate(
        patient_id,
        date_time,
        category,
        remark
      );
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
);

//include page size
router.get(
  "/followUpList/:page",
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
      const result = await followUp.followUpList(page, page_size);
      res.json(result);
    } catch (error) {
      res.status(error);
    }
  }
);

//not include page_size
router.get(
  "/followUpOnlyList",
  // [param("page").notEmpty().isInt().toInt()],
  async (req, res) => {
    try {
      // const errors = validationResult(req);
      // if (!errors.isEmpty()) {
      //   return res.json(new StatusCode.INVALID_ARGUMENT(errors.errors[0].msg));
      // }
      const result = await followUp.followUpOnlyList();
      res.json(result);
    } catch (error) {
      res.status(error);
    }
  }
);

router.put(
  "/followUpUpdate/:id",
  [
    // Validate patient_id
    body("patient_id")
      .notEmpty()
      .withMessage("Patient ID is required")
      .isInt()
      .withMessage("Patient ID must be an integer"),

    // Validate date_time
    body("date_time")
      .notEmpty()
      .withMessage("Date and time is required")
      .matches(/^\d{4}\/\d{2}\/\d{2} \d{2}:\d{2} (AM|PM)$/i)
      .withMessage("Date and time must be in yyyy/mm/dd hh:mm format"),

    // Validate category
    body("category")
      .notEmpty()
      .withMessage("Category is required")
      .matches(/^[a-zA-Z ]+$/)
      .withMessage("Category can only contain letters and spaces"),

    // Validate remark (if needed)
    // body("remark")
    //   .optional()
    //   .matches(/^[a-zA-Z0-9 ]*$/)
    //   .withMessage("Remark can only contain letters, numbers, and spaces"),

    // Validate remainder_2
    body("remainder_2")
      .optional({ nullable: true }) // Allows null or empty string
      .if(body("remainder_2").exists()) // Check if remainder_2 exists
      .matches(/^\d{4}\/\d{2}\/\d{2}$/)
      .withMessage("remainder_2 must be in yyyy/mm/dd format"),

    // Validate remainder_1 or allow null
    body("remainder_1")
      .optional({ nullable: true }) // Allows null or empty string
      .if(body("remainder_1").exists()) // Check if remainder_1 exists
      .matches(/^\d{4}\/\d{2}\/\d{2}$/)
      .withMessage("remainder_1 must be in yyyy/mm/dd format"),

    // Validate id parameter
    param("id")
      .notEmpty()
      .withMessage("ID parameter is required")
      .isInt()
      .withMessage("ID parameter must be an integer"),
  ],
  async (req, res) => {
    console.log(req.body);
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json(new StatusCode.INVALID_ARGUMENT(errors));
      }
      const {
        patient_id,
        date_time,
        category,
        remark,
        remainder_2,
        remainder_1,
      } = req.body;
      const { id } = req.params;
      const result = await followUp.followUpUpdate(
        patient_id,
        date_time,
        category,
        remark,
        remainder_2,
        remainder_1,
        id
      );
      res.json(result);
    } catch (error) {
      res.status(error);
    }
  }
);

router.delete(
  "/followUpDelete/:id",
  [param("id").notEmpty().isInt().toInt().withMessage("Must Be Number")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json(new StatusCode.INVALID_ARGUMENT(errors.errors[0].msg));
    }

    const { id } = req.params;
    console.log(id);

    const result = await followUp.followUpDelete(id);
    res.json(result);
    try {
    } catch (error) {
      res.status(error);
    }
  }
);

//get with patient_id
router.post(
  "/followUpPatientIdSearch",
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
      const result = await followUp.followUpPatientIdSearch(patient_id);
      res.json(result);
    } catch (error) {
      res.status(error);
    }
  }
);

// Id Search
router.get(
  "/followUpIDSearch/:id",
  [param("id").notEmpty().isInt().toInt()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json(new StatusCode.INVALID_ARGUMENT(errors.errors[0].msg));
      }
      const id = req.params.id;
      const result = await followUp.folllowUpIdSearch(id);
      res.json(result);
    } catch (error) {
      res.status(error);
    }
  }
);

//Date Search
router.get(
  "/followUpDateSearch",
  // [
  //   body("date")
  //     .notEmpty()
  //     .withMessage("Date is required")
  //     .matches(/^\d{4}\/\d{2}\/\d{2}$/) // Matches format yyyy/mm/dd
  //     .withMessage("Start_Date  must be in yyyy/mm/dd format"),
  // ],
  async (req, res) => {
    try {
      // const errors = validationResult(req);
      // if (!errors.isEmpty()) {
      //   return res.json(new StatusCode.INVALID_ARGUMENT(errors.errors[0].msg));
      // }
      // const { date } = req.body;

      // const formattedDate = date.split("/").join("-");
      // console.log(date);

      const result = await followUp.followUpDateSearch();
      return res.json(result);
    } catch (error) {
      res.status(error);
    }
  }
);

module.exports = router;
