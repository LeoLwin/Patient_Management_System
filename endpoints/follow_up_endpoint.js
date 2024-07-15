const router = require("express").Router();
const { param, body, validationResult } = require("express-validator");
const followUp = require("../models/followUp_model");
const StatusCode = require("../helper/status_code_helper");
const follow_Up_Helper = require("../helper/follow_up_helper");
const { route } = require("./patient_endpoint");

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
    body("location_name").custom((value) => {
      // Check if the name contains special characters
      const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;
      if (specialCharsRegex.test(value)) {
        throw new Error("location_name cannot contain special characters");
      }
      // Return true to indicate validation passed
      return true;
    }),
    body("doctor_name").custom((value) => {
      // Check if the name contains special characters
      const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;
      if (specialCharsRegex.test(value)) {
        throw new Error("Doctor_Name cannot contain special characters");
      }
      // Return true to indicate validation passed
      return true;
    }),
    body("doctor_position").custom((value) => {
      // Check if the name contains special characters
      const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;
      if (specialCharsRegex.test(value)) {
        throw new Error("Doctor_Position cannot contain special characters");
      }
      // Return true to indicate validation passed
      return true;
    }),
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
      console.log(req.body);
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json(new StatusCode.INVALID_ARGUMENT(errors.errors[0].msg));
      }
      const {
        patient_id,
        date_time,
        category,
        location_name,
        doctor_name,
        doctor_position,
        remark,
      } = req.body;

      const result = await followUp.followUpCreate(
        patient_id,
        date_time,
        category,
        location_name,
        doctor_name,
        doctor_position,
        remark
      );
      res.json(result);
      // res.json(req.body);
    } catch (error) {
      res.json(new StatusCode.UNKNOWN(error.message));
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
      res.json(new StatusCode.UNKNOWN(error.message));
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
      res.json(new StatusCode.UNKNOWN(error.message));
    }
  }
);

//hospital and lab list
router.post(
  "/hospitalList",
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
    console.log(req.body);
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json(new StatusCode.INVALID_ARGUMENT(errors.errors[0].msg));
      }
      const patient_id = req.body.patient_id;
      const result = await followUp.hospitalList(patient_id);
      res.json(result);
    } catch (error) {
      res.json(new StatusCode.UNKNOWN(error.message));
    }
  }
);

router.post(
  "/followUpList",
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
    console.log(req.body);
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json(new StatusCode.INVALID_ARGUMENT(errors.errors[0].msg));
      }
      const patient_id = req.body.patient_id;
      const result = await followUp.followUpList(patient_id);
      res.json(result);
    } catch (error) {
      res.json(new StatusCode.UNKNOWN(error.message));
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
    body("doctor_name").custom((value) => {
      // Check if the name contains special characters
      const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;
      if (specialCharsRegex.test(value)) {
        throw new Error("Doctor_Name cannot contain special characters");
      }
      // Return true to indicate validation passed
      return true;
    }),
    body("doctor_position").custom((value) => {
      // Check if the name contains special characters
      const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;
      if (specialCharsRegex.test(value)) {
        throw new Error("Doctor_Position cannot contain special characters");
      }
      // Return true to indicate validation passed
      return true;
    }),
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
    body("reminder_3")
      .optional({ nullable: true }) // Allows null or empty string
      .if(body("remainder_2").exists()) // Check if remainder_2 exists
      .matches(/^\d{4}\/\d{2}\/\d{2}$/)
      .withMessage("remainder_2 must be in yyyy/mm/dd format"),
    body("reminder_2")
      .optional({ nullable: true }) // Allows null or empty string
      .if(body("remainder_2").exists()) // Check if remainder_2 exists
      .matches(/^\d{4}\/\d{2}\/\d{2}$/)
      .withMessage("remainder_2 must be in yyyy/mm/dd format"),

    // Validate remainder_1 or allow null
    body("reminder_1")
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
    try {
      console.log(req.body);
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json(new StatusCode.INVALID_ARGUMENT(errors));
      }
      const {
        patient_id,
        date_time,
        category,
        location_name,
        doctor_name,
        doctor_position,
        remark,
        reminder_3,
        reminder_2,
        reminder_1,
      } = req.body;
      const { id } = req.params;
      const result = await followUp.followUpUpdate(
        patient_id,
        date_time,
        category,
        location_name,
        doctor_name,
        doctor_position,
        remark,
        reminder_3,
        reminder_2,
        reminder_1,
        id
      );
      res.json(result);
    } catch (error) {
      res.json(new StatusCode.UNKNOWN(error.message));
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
      res.json(new StatusCode.UNKNOWN(error.message));
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
      res.json(new StatusCode.UNKNOWN(error.message));
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
      res.json(new StatusCode.UNKNOWN(error.message));
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
      res.json(new StatusCode.UNKNOWN(error.message));
    }
  }
);

//updateReminder
router.get(
  "/updateReminder/:id",
  [param("id").notEmpty().isInt().toInt()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json(new StatusCode.INVALID_ARGUMENT(errors.errors[0].msg));
      }
      const id = req.params.id;
      const fu_data = await followUp.folllowUpIdSearch(id);
      if (fu_data.code !== "200") {
        res.json(fu_data);
      }
      const getReminder = await follow_Up_Helper.getUpdateReminder(
        fu_data.data.date_time
      );

      if (getReminder.data == 1) {
        let getDate = await follow_Up_Helper.getCurrentDate();
        const result = await followUp.followUpUpdate(
          fu_data.data.patient_id,
          fu_data.data.date_time,
          fu_data.data.category,
          fu_data.data.remark,
          getDate.data,
          null,
          id
        );
        res.json({ result });
      } else {
        let getBeforeDate = await follow_Up_Helper.getBeforeOneDay();
        const result = await followUp.followUpUpdate(
          fu_data.data.patient_id,
          fu_data.data.date_time,
          fu_data.data.category,
          fu_data.data.remark,
          null,
          getBeforeDate.data,
          id
        );
        res.json(result);
      }
    } catch (error) {
      res.json(new StatusCode.UNKNOWN(error.message));
    }
  }
);

module.exports = router;
