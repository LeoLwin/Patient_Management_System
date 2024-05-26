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

app.get("/images/:filename", (req, res) => {
  const fileName = req.params.filename;

  const filePath = path.join(__dirname, "uploads", fileName);

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      res.status(404).send({ message: "Check your file name!" });
    } else {
      res.sendFile(filePath);
    }
  });
});

app.use("/", index_endpoint);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
