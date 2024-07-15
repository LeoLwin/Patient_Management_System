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
      console.log(error);
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

router.put(
  "/followUpUpdate/:id",
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
      console.log(req.body);
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

      let getDate = new Date();

      if (getReminder.data == 2) {
        console.log("GO to 2");
        const result = await followUp.followUpUpdate(
          fu_data.data.patient_id,
          fu_data.data.date_time,
          fu_data.data.category,
          fu_data.data.location_name,
          fu_data.data.doctor_name,
          fu_data.data.doctor_position,
          fu_data.data.remark,
          getDate,
          null,
          null,
          id
        );
        res.json({ result });
      } else if (getReminder.data == 1) {
        console.log("GO to 1");
        const result = await followUp.followUpUpdate(
          fu_data.data.patient_id,
          fu_data.data.date_time,
          fu_data.data.category,
          fu_data.data.location_name,
          fu_data.data.doctor_name,
          fu_data.data.doctor_position,
          fu_data.data.remark,
          null,
          getDate,
          null,
          id
        );
        res.json(result);
      } else {
        console.log("GO to 0");
        const result = await followUp.followUpUpdate(
          fu_data.data.patient_id,
          fu_data.data.date_time,
          fu_data.data.category,
          fu_data.data.location_name,
          fu_data.data.doctor_name,
          fu_data.data.doctor_position,
          fu_data.data.remark,
          null,
          null,
          getDate,
          id
        );
        res.json(result);
      }
    } catch (error) {
      console.log(error);
      res.json(new StatusCode.UNKNOWN(error.message));
    }
  }
);

module.exports = router;
