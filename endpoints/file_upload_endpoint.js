const router = require("express").Router();
const FileUpload = require("../helper/file_upload_helper");
const File = require("../models/file_model");
const StatusCode = require("../helper/status_code_helper");
const { query, param, body, validationResult } = require("express-validator");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const { validateToken, admin } = require("../middlewares/middleware");
const log = require("../models/logs_models");

//file only delete
router.delete("/delete", validateToken, admin, async (req, res) => {
  try {
    const path = req.body;
    console.log(path.filePath);
    const result = await FileUpload.fileDelete(path.filePath);
    return res.json(result);
  } catch (error) {
    return res.status(new StatusCode.UNKNOWN(error.message));
  }
});

router.post(
  "/fileCreate",
  validateToken,
  admin,
  upload.single("name"),
  [
    body("path").notEmpty().withMessage("Path is required"),
    body("patient_id")
      .notEmpty()
      .withMessage("Patient_id is required")
      .trim()
      .escape()
      .custom((value, { req, res }) => {
        // Check if the value is an integer
        if (!Number.isInteger(Number(value))) {
          throw new StatusCode.UNKNOWN("Patient_id must be an integer");
        }
        // Check if the name contains special characters
        const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;
        if (specialCharsRegex.test(value)) {
          throw new StatusCode.UNKNOWN(
            "Patient_id cannot contain special characters"
          );
        }
        // Return true to indicate validation passed
        return true;
      }),
    body("type")
      .notEmpty()
      .withMessage("Type is required")
      .trim()
      .escape()
      .custom((value) => {
        // Check if the name contains special characters
        const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;
        if (specialCharsRegex.test(value)) {
          throw new StatusCode.UNKNOWN(
            "Type cannot contain special characters"
          );
        }
        // Return true to indicate validation passed
        return true;
      }),

    body("file").custom((value, { req }) => {
      if (!req.file && !req.body.path) {
        throw new StatusCode.UNKNOWN(
          "Either file or Folder Name must be provided"
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
      if (req.file) {
        const file = req.file;
        const { patient_id, path, type } = req.body;
        console.log(req.body);

        const uploadResult = await FileUpload.fileOnlyUpload(file, patient_id);

        if (uploadResult.code === "500") {
          return res.status(uploadResult.message);
        }

        const mb = await FileUpload.fileByteToSize(file.size);

        const name = uploadResult.data;
        const size = mb.data;
        const result = await File.fileCreate(
          patient_id,
          name,
          path,
          size,
          type
        );
        if (result.code !== "200") {
          res.json(result);
          return;
        }

        const descriptin = "New File Created";
        const addLog = await log.addLog(created_by, last_p_ID, descriptin);
      } else {
        const { patient_id, name, path, type } = req.body;
        console.log(req.body);
        size = "0MB";
        const result = await File.fileCreate(
          patient_id,
          name,
          path,
          size,
          type
        );
        res.json(result);
      }

      // res.json(req.file);
    } catch (error) {
      return res.status(new StatusCode.UNKNOWN(error.message));
    }
  }
);

router.get(
  "/fileList/:page",
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
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json(new StatusCode.INVALID_ARGUMENT(errors.errors[0].msg));
      }
      const { page } = req.params;
      const result = await File.fileList(page);
      res.json(result);
    } catch (error) {
      res.json(new StatusCode.UNKNOWN(error.message));
    }
  }
);

router.put(
  "/fileUpdate/:id",
  validateToken,
  admin,
  upload.single("name"),
  [
    body("path").notEmpty().withMessage("Path is required"),
    body("patient_id")
      .notEmpty()
      .withMessage("Patient_id is required")
      .trim()
      .escape()
      .custom((value) => {
        // Check if the value is an integer
        if (!Number.isInteger(Number(value))) {
          throw new StatusCode.UNKNOWN("Patient_id must be an integer");
        }
        // Check if the name contains special characters
        const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;
        if (specialCharsRegex.test(value)) {
          throw new StatusCode.UNKNOWN(
            "Patient_id cannot contain special characters"
          );
        }
        return true;
      }),
    body("type")
      .notEmpty()
      .withMessage("Type is required")
      .trim()
      .escape()
      .custom((value) => {
        // Check if the name contains special characters
        const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;
        if (specialCharsRegex.test(value)) {
          throw new StatusCode.UNKNOWN(
            "Type cannot contain special characters"
          );
        }
        // Return true to indicate validation passed
        return true;
      }),

    body("name").custom((value, { req }) => {
      // Check if either file or Folder Name must be provided
      if (!req.file && !req.body.path) {
        throw new StatusCode.UNKNOWN(
          "Either file or Folder Name must be provided"
        );
      }
      // Check if the name contains special characters
      const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;
      if (specialCharsRegex.test(value)) {
        throw new StatusCode.UNKNOWN("Name cannot contain special characters");
      }
      // Return true to indicate validation passed
      return true;
    }),

    param("id").notEmpty().isInt().toInt(),
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
      const { patient_id, name: nameUrl, path, type } = req.body;

      const { id } = req.params;
      let name;
      let size;
      let deleteStatus = false;

      if (req.file) {
        console.log(req.file);
        name = req.file;
        bytes = req.file.size;
        console.log(bytes);
        const getmb = await FileUpload.fileByteToSize(bytes);
        console.log(getmb);
        size = getmb.data;
        console.log("Size", size);
        console.log({ patient_id, name, path, size, type });
        console.log(id);
      } else if (nameUrl) {
        name = nameUrl;
        size = "0 MB";
        deleteStatus = true;
        console.log({ patient_id, name, path, size, type });
        console.log(id);
      }

      const file = await File.fileIdSearch(id);
      console.log(file);
      if (file.code !== "200") {
        res.json(file);
        return;
      }
      const currentPath = file.data[0].path;
      console.log("File Path", currentPath);
      if ((req.file && currentPath) || deleteStatus) {
        const deleteResult = await FileUpload.fileOnlyDelete(currentPath);
        console.log("Delete Result", deleteResult);
      }
      let newname;

      if (req.file) {
        const uploadResult = await FileUpload.fileOnlyUpload(name);
        console.log("Uploaded Image URL", uploadResult);
        if (uploadResult.code === "200") {
          newname = uploadResult.data;
          console.log("newname", newname);
        } else {
          return res.json({ uploadResult: "File upload failed" });
        }
      } else if (name) {
        newname = nameUrl;
      }

      console.log("This is endpoint ", {
        patient_id,
        newname,
        path,
        size,
        type,
        id,
      });

      const updateResult = await File.fileUpdate(
        patient_id,
        newname,
        path,
        size,
        type,
        id
      );
      return res.json(updateResult);
    } catch (error) {
      res.json(new StatusCode.UNKNOWN(error.message));
    }
  }
);

router.delete(
  "/fileDelete/:id",
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
      const { id } = req.params;
      const file = await File.fileIdSearch(id);
      console.log(file);
      if (file.code !== "200") {
        return res.json(file);
      }

      console.log("File Path", file.data[0].type);
      if (file.data[0].type === "file") {
        console.log("File Path.......", file.data[0].name);
        const currentPath = await FileUpload.checkFilePath(file.data[0].name);
        console.log("File is true or false : ", currentPath);
        console.log("True or false", currentPath.code);
        if (currentPath.code == "200") {
          const deleteResult = await FileUpload.fileOnlyDelete(
            file.data[0].name
          );
          console.log("Delete Result", deleteResult);
        }
        const result = await File.fileDelete(id);
        res.json(result);
        return;
      } else {
        const sendPath = file.data[0].path + ">" + file.data[0].name;
        console.log(sendPath);
        const FolderData = await File.pathSearch(sendPath, file.data[0].name);

        if (FolderData.code === "403") {
          res.json(FolderData);
          return;
        }

        if (FolderData.code === "404") {
          const result = await File.fileDelete(id);
          res.json(result);
          return;
        }

        if (FolderData.data.length > 0) {
          console.log("Length", FolderData.data.length);
          FolderData.data.forEach(async (item) => {
            const deletePromise = await File.fileDelete(item.id);
            console.log(deletePromise);
          });
        }
        await File.fileDelete(id);
        res.json(new StatusCode.OK("File is deleted!"));
      }
    } catch (error) {
      res.json(new StatusCode.UNKNOWN(error.message));
    }
  }
);

// file Id Search
router.get(
  "/fileIDSearch/:id",
  validateToken,
  admin,
  [
    param("id").notEmpty().isInt().withMessage("ID must be integer .").toInt(),
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
    console.log(req.params);
    try {
      const result = await File.fileIdSearch(req.params.id);
      res.json(result);
    } catch (error) {
      res.json(new StatusCode.UNKNOWN(error.message));
    }
  }
);

//folder search
router.post(
  "/typeSearch",
  validateToken,
  admin,
  [
    body("type")
      .notEmpty()
      .withMessage("Type is required")
      .trim()
      .escape()
      .custom((value) => {
        // Check if the name contains special characters
        const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;
        if (specialCharsRegex.test(value)) {
          throw new StatusCode.UNKNOWN(
            "Type cannot contain special characters"
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
      const { type } = req.body;
      const result = await File.typeSearch(type);
      res.json(result);
    } catch (error) {
      res.status(500).json(new StatusCode.UNKNOWN(error.message));
    }
  }
);

//mainFolder Search
router.get(
  "/mainfFolderSearch",
  validateToken,
  admin,
  [
    query("path").notEmpty().withMessage("Path is required"),
    query("patient_id")
      .notEmpty()
      .withMessage("Patient_id should not be empty.")
      .isInt()
      .withMessage("ID Must be integer!")
      .toInt(),
    (req, res, next) => {
      console.log(req.body);
      const errors = validationResult(req);
      console.log(errors);
      if (!errors.isEmpty()) {
        return res.json(new StatusCode.INVALID_ARGUMENT(errors.errors[0].msg));
      }
      next();
    },
  ],
  async (req, res) => {
    try {
      const { patient_id, path } = req.query;

      // Validate or process the parameters as needed
      if (!patient_id || !path) {
        return res.status(400).json({
          error: "patient_id and path are required in query parameters",
        });
      }

      const result = await File.fileSearch(patient_id, path);
      // console.log("End point", result);
      res.json(result);
      return;
    } catch (error) {
      console.error("Error:", error.message);
      res.status(500).json({ message: "Server Error" });
    }
  }
);

module.exports = router;
