require("dotenv").config();
const express = require("express");
const cors = require("cors");
const config = require("./configurations/config");
const index_endpoint = require("./endpoints/index_endpoint");
const path = require("path");
const fs = require("fs");

const app = express();
PORT = config.PORT || 2000;

app.use(cors());
app.use(express.json({ limit: "500mb" }));

app.get("/images/:nrc/:filename", (req, res) => {
  const nrc = req.params.nrc;
  const fileName = req.params.filename;

  // const sanitizedNrc = nrc.replace(/\//g, "_");
  const filePath = path.join(__dirname, "uploads", nrc, fileName);

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      res.status(404).send({ message: "Check your file name!" });
    } else {
      console.log(filePath);
      res.sendFile(filePath);
    }
  });
});

app.delete("/images/:nrc/:filename", async (req, res) => {
  const nrc = req.params.nrc;
  const fileName = req.params.filename;

  try {
    const sanitizedNrc = nrc.replace(/\//g, "_");
    const filePath = path.join(__dirname, "uploads", sanitizedNrc, fileName);
    console.log("Deleting file:", filePath);

    await fs.unlink(filePath);
    console.log("File deleted successfully");
    return res.status({ message: "File is deleted" });
  } catch (error) {
    console.error("Error deleting file:", error);
    return res.status({ message: error.message });
  }
});

app.use("/", index_endpoint);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
