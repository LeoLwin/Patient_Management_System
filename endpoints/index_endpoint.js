const router = require("express").Router();

const patient = require("./patient_endpoint");
const login = require("./google_login_endpoint");
const admin = require("./admin_endpoint");
const mainForm = require("./main_form_endpoint");
const formData = require("./form_data_endpoint");
const fileUpload = require("./file_upload_endpoint");
const partner = require("./partner_endpoint");
const tag = require("./tags_endpoint");
const HospAndLab = require("./hospital_and _lab");
const followUp = require("./follow_up_endpoint");

router.use("/patient", patient);
router.use("/login", login);
router.use("/admin", admin);
router.use("/mainForm", mainForm);
router.use("/formData", formData);
router.use("/fileUpload", fileUpload);
router.use("/partner", partner);
router.use("/tag", tag);
router.use("/hospAndLab", HospAndLab);
router.use("/followUp", followUp);

// router.get("/images/:nrc/:filename", (req, res) => {
//   const nrc = req.params.nrc;
//   const fileName = req.params.filename;
//   console.log(nrc);
//   console.log(fileName);

//   const sanitizedNrc = nrc.replace(/\//g, "_");
//   console.log("__dirname", __dirname);
//   const filePath = path.join(__dirname, "uploads", sanitizedNrc, fileName);
//   console.log(filePath);

//   fs.access(filePath, fs.constants.F_OK, (err) => {
//     console.log("Testing", fs.constants.F_OK);
//     if (err) {
//       console.log(err);
//       res.status(404).send({ message: "Check your file name!" });
//     } else {
//       res.sendFile(filePath);
//     }
//   });
// });

// router.delete("/images/:nrc/:filename", async (req, res) => {
//   const nrc = req.params.nrc;
//   const fileName = req.params.filename;

//   try {
//     const sanitizedNrc = nrc.replace(/\//g, "_");
//     const filePath = path.join(__dirname, "uploads", sanitizedNrc, fileName);
//     console.log("Deleting file:", filePath);

//     await fs.unlink(filePath);
//     console.log("File deleted successfully");
//     return res.status({ message: "File is deleted" });
//   } catch (error) {
//     console.error("Error deleting file:", error);
//     return res.status({ message: error.message });
//   }
// });

module.exports = router;
