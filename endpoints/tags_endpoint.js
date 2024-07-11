// const router = require("express").Router();
// const Tag = require("../models/tags_model");
// const { param, body, validationResult } = require("express-validator");
// const StatusCode = require("../helper/status_code_helper");

// router.post(
//   "/tagCreate",
//   [
//     body("tag_name")
//       .notEmpty()
//       .withMessage("Tag-Name is required")
//       .trim()
//       .escape()
//       .custom((value) => {
//         // Check if the name contains special characters
//         const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;
//         if (specialCharsRegex.test(value)) {
//           throw new Error("Name cannot contain special characters");
//         }
//         // Return true to indicate validation passed
//         return true;
//       }),
//   ],
//   async (req, res) => {
//     try {
//       const errors = validationResult(req);
//       if (!errors.isEmpty()) {
//         return res.json(new StatusCode.INVALID_ARGUMENT(errors.errors[0].msg));
//       }
//       const { tag_name } = req.body;

//       const result = await Tag.tagCreate(tag_name);
//       res.json(result);
//     } catch (error) {
//       res.json(error);
//     }
//   }
// );

// router.get(
//   "/tagList/:page",
//   [param("page").notEmpty().isInt().toInt()],
//   async (req, res) => {
//     try {
//       const errors = validationResult(req);
//       if (!errors.isEmpty()) {
//         return res.json(new StatusCode.INVALID_ARGUMENT(errors.errors[0].msg));
//       }
//       const { page } = req.params;
//       const result = await Tag.tagList(page);
//       res.json(result);
//     } catch (error) {
//       res.status(error);
//     }
//   }
// );

// router.put(
//   "/tagUpdate/:id",
//   [
//     body("tag_name")
//       .notEmpty()
//       .withMessage("Tag-Name is required")
//       .trim()
//       .escape()
//       .custom((value) => {
//         // Check if the name contains special characters
//         const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;
//         if (specialCharsRegex.test(value)) {
//           throw new Error("Name cannot contain special characters");
//         }
//         // Return true to indicate validation passed
//         return true;
//       }),
//     param("id").notEmpty().isInt().toInt(),
//   ],
//   async (req, res) => {
//     try {
//       const errors = validationResult(req);
//       if (!errors.isEmpty()) {
//         return res.json(new StatusCode.INVALID_ARGUMENT(errors));
//       }
//       const { tag_name } = req.body;
//       const { id } = req.params;
//       const result = await Tag.tagUpdate(tag_name, id);
//       res.json(result);
//     } catch (error) {
//       res.status(error);
//     }
//   }
// );

// router.delete(
//   "/tagDelete/:id",
//   [param("id").notEmpty().isInt().toInt()],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.json(new StatusCode.INVALID_ARGUMENT(errors.errors[0].msg));
//     }
//     const { id } = req.params;
//     const result = await Tag.tagDelete(id);
//     res.json(result);
//     try {
//     } catch (error) {
//       res.status(error);
//     }
//   }
// );

// module.exports = router;
