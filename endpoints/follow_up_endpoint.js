const router = require("express").Router();
const { param, body, validationResult } = require("express-validator");
const followUp = require("../models/followUp_model");
const StatusCode = require("../helper/status_code_helper");
const follow_Up_Helper = require("../helper/follow_up_helper");

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
          throw new StatusCode.UNKNOWN("ID must be an integer");
          // throw new Error("ID must be an integer");
        }
        // Check if the name contains special characters
        const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;
        if (specialCharsRegex.test(value)) {
          throw new StatusCode.UNKNOWN(
            "Name cannot contain special characters"
          );
          // throw new Error("Name cannot contain special characters");
        }
        // Return true to indicate validation passed
        return true;
      }),
    body("date_time")
      .notEmpty()
      .custom((value) => {
        // Validate the format using regex
        const dateTimeRegex = /^\d{4}\/\d{2}\/\d{2} \d{2}:\d{2} (AM|PM)$/i;
        if (!dateTimeRegex.test(value)) {
          throw new StatusCode.UNKNOWN(
            "Date and time must be in yyyy/mm/dd hh:mm AM/PM format"
          );
        }
        return true;
      }),
    body("location_name").custom((value) => {
      // Check if the name contains special characters
      const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;
      if (specialCharsRegex.test(value)) {
        throw new StatusCode.UNKNOWN(
          "location_name cannot contain special characters"
        );
      }

      return true;
    }),
    body("doctor_name").custom((value) => {
      // Check if the name contains special characters
      const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;
      if (specialCharsRegex.test(value)) {
        throw new StatusCode.UNKNOWN(
          "Doctor_Name cannot contain special characters"
        );
      }
      return true;
    }),
    body("doctor_position").custom((value) => {
      // Check if the name contains special characters
      const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;
      if (specialCharsRegex.test(value)) {
        throw new StatusCode.UNKNOWN(
          "Doctor_Position cannot contain special characters"
        );
      }
      return true;
    }),
    body("category")
      .notEmpty()
      .withMessage("Category is required")
      .trim()
      .escape()
      .custom((value) => {
        const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;
        if (specialCharsRegex.test(value)) {
          throw new StatusCode.UNKNOWN(
            "Category cannot contain special characters"
          );
        }
        return true;
      }),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json(
          new StatusCode.INVALID_ARGUMENT(errors.errors[0].msg.message)
        );
      }
      next();
    },
  ],
  async (req, res) => {
    try {
      console.log(req.body);
      // const errors = validationResult(req);
      // if (!errors.isEmpty()) {
      //   return res.json(new StatusCode.INVALID_ARGUMENT(errors.errors[0].msg));
      // }
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
          // throw new Error("ID must be an integer");
          throw new StatusCode.UNKNOWN("ID must be an integer");
        }
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
        return res.json(
          new StatusCode.INVALID_ARGUMENT(errors.errors[0].msg.message)
        );
      }
      next();
    },
  ],
  async (req, res) => {
    console.log(req.body);
    try {
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
          throw new StatusCode.UNKNOWN("ID must be an integer");
        }
        // Check if the name contains special characters
        const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;
        if (specialCharsRegex.test(value)) {
          throw new StatusCode.UNKNOWN(
            "Name cannot contain special characters"
          );
        }
        return true;
      }),
    body("date_time")
      .notEmpty()
      .custom((value) => {
        // Validate the format using regex
        const dateTimeRegex = /^\d{4}\/\d{2}\/\d{2} \d{2}:\d{2} (AM|PM)$/i;
        if (!dateTimeRegex.test(value)) {
          throw new StatusCode.UNKNOWN(
            "Date and time must be in yyyy/mm/dd hh:mm AM/PM format"
          );
        }
        return true;
      }),
    body("location_name").custom((value) => {
      // Check if the name contains special characters
      const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;
      if (specialCharsRegex.test(value)) {
        throw new StatusCode.UNKNOWN(
          "location_name cannot contain special characters"
        );
      }
      // Return true to indicate validation passed
      return true;
    }),
    body("doctor_name").custom((value) => {
      // Check if the name contains special characters
      const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;
      if (specialCharsRegex.test(value)) {
        throw new StatusCode.UNKNOWN(
          "Doctor_Name cannot contain special characters"
        );
      }
      // Return true to indicate validation passed
      return true;
    }),
    body("doctor_position").custom((value) => {
      // Check if the name contains special characters
      const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;
      if (specialCharsRegex.test(value)) {
        throw new StatusCode.UNKNOWN(
          "Doctor_Position cannot contain special characters"
        );
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
          throw new StatusCode.UNKNOWN(
            "Category cannot contain special characters"
          );
        }
        // Return true to indicate validation passed
        return true;
      }),

    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json(
          new StatusCode.INVALID_ARGUMENT(errors.errors[0].msg.message)
        );
      }
      next();
    },
  ],
  async (req, res) => {
    try {
      console.log(req.body);
      const {
        patient_id,
        date_time,
        category,
        location_name,
        doctor_name,
        doctor_position,
        remark,
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
        null,
        null,
        null,
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
  [
    param("id").notEmpty().isInt().withMessage("ID must be number").toInt(),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json(new StatusCode.INVALID_ARGUMENT(errors.errors[0].msg));
      }
      next();
    },
  ],
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
          throw new StatusCode.UNKNOWN("ID must be an integer");
          // throw new Error("ID must be an integer");
        }
        // Check if the name contains special characters
        const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;
        if (specialCharsRegex.test(value)) {
          throw new StatusCode.UNKNOWN(
            "Name cannot contain special characters"
          );
        }
        return true;
      }),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json(
          new StatusCode.INVALID_ARGUMENT(errors.errors[0].msg.message)
        );
      }
      next();
    },
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
  [param("id").notEmpty().isInt().withMessage("ID Must be integer !").toInt()],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json(new StatusCode.INVALID_ARGUMENT(errors.errors[0].msg));
    }
    next();
  },
  async (req, res) => {
    try {
      console.log(req.body);

      const id = req.params.id;
      const result = await followUp.folllowUpIdSearch(id);
      res.json(result);
    } catch (error) {
      res.json(new StatusCode.UNKNOWN(error.message));
    }
  }
);

//Date Search
router.get("/followUpDateSearch", async (req, res) => {
  try {
    const result = await followUp.followUpDateSearch();
    return res.json(result);
  } catch (error) {
    res.json(new StatusCode.UNKNOWN(error.message));
  }
});

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

      console.log(getReminder);

      let getDate = await follow_Up_Helper.getCurrentDate();
      console.log("Current Date", getDate);
      console.log(getReminder);

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
          null,
          null,
          getDate.data,
          id
        );
        res.json({ result });
        return;
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
          getDate.data,
          fu_data.data.reminder_1,
          id
        );
        res.json(result);
        return;
      } else if (getReminder.data == 0) {
        console.log("GO to 0");
        const result = await followUp.followUpUpdate(
          fu_data.data.patient_id,
          fu_data.data.date_time,
          fu_data.data.category,
          fu_data.data.location_name,
          fu_data.data.doctor_name,
          fu_data.data.doctor_position,
          fu_data.data.remark,
          getDate.data,
          fu_data.data.reminder_2,
          fu_data.data.reminder_1,
          id
        );
        res.json(result);
        return;
      } else {
        res.json(getReminder);
      }
    } catch (error) {
      console.log(error);
      res.json(new StatusCode.UNKNOWN(error.message));
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
      .custom((value) => {
        // Validate the format using regex
        const dateTimeRegex = /^\d{4}\/\d{2}\/\d{2}$/;
        if (!dateTimeRegex.test(value)) {
          throw new StatusCode.UNKNOWN(
            "Start_Date and time must be in yyyy/mm/dd format"
          );
        }
        return true;
      }),
    body("end_date")
      .notEmpty()
      .withMessage("End_Date is required")
      .custom((value) => {
        // Validate the format using regex
        const dateTimeRegex = /^\d{4}\/\d{2}\/\d{2}$/;
        if (!dateTimeRegex.test(value)) {
          throw new StatusCode.UNKNOWN(
            "End_Date and time must be in yyyy/mm/dd format"
          );
        }
        return true;
      }),
    body("location_name")
      .notEmpty()
      .withMessage("location_name is required")
      .trim()
      .escape()
      .custom((value) => {
        // Check if the name contains special characters
        const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;
        if (specialCharsRegex.test(value)) {
          throw new StatusCode.UNKNOWN(
            "location_name cannot contain special characters"
          );
        }
        // Return true to indicate validation passed
        return true;
      }),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json(
          new StatusCode.INVALID_ARGUMENT(errors.errors[0].msg.message)
        );
      }
      next();
    },
  ],
  async (req, res) => {
    try {
      const { start_date, end_date, location_name } = req.body;
      console.log(req.body);

      const formattedStartDate = start_date.split("/").join("-");
      const formattedEndDate = end_date.split("/").join("-");

      const result = await followUp.hospAndLabDateSearch(
        formattedStartDate,
        formattedEndDate,
        location_name
      );
      return res.json(result);
    } catch (error) {
      res.json(new StatusCode.UNKNOWN(error.message));
    }
  }
);

module.exports = router;
