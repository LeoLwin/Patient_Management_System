require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const config = require("./configurations/config");
const index_endpoint = require("./endpoints/index_endpoint");

const path = require("path");
const fs = require("fs");

const app = express();

PORT = config.PORT || 2000;
let host = "0.0.0.0";

const corsOptions = {
  // origin: ["http://192.168.100.44:5000", "http://192.168.100.18:5173"],
  origin: "*",
  credentials: true, // Access-Control-Allow-Credentials: true
};

app.use(cors(corsOptions));
app.use(cookieParser());

// app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "500mb" }));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.cookie("user", "John Doe", { maxAge: 900000, httpOnly: true });
  res.send("Cookie has been set");
});

app.get("/uploads/:id/:filename", async (req, res) => {
  const id = req.params.id;
  const fileName = req.params.filename;

  // const sanitizedNrc = nrc.replace(/\//g, "_");
  const filePath = path.join(__dirname, "uploads", id, fileName);

  await fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      res.status(404).send({ message: "Check your file name!" });
    } else {
      res.sendFile(filePath);
    }
  });
});

app.delete("/uploads/:id/:filename", async (req, res) => {
  const id = req.params.id;
  const fileName = req.params.filename;

  try {
    // const sanitizedNrc = nrc.replace(/\//g, "_");
    const filePath = path.join(__dirname, "uploads", id, fileName);
    console.log("Deleting file:", filePath);

    await fs.unlink(filePath);
    console.log("File deleted successfully");
    return res.status({ message: "File is deleted" });
  } catch (error) {
    console.error("Error deleting file:", error);
    return res.status({ message: error.message });
  }
});

app.get("/uploads/:filename", async (req, res) => {
  const fileName = req.params.filename;
  const filePath = path.join(__dirname, "uploads", fileName);

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      res.status(404).send({ message: "Check your file na  me!" });
    } else {
      res.sendFile(filePath);
    }
  });
});

app.use("/", index_endpoint);

app.listen(PORT, host, () => {
  console.log(`Server is listening on http://${host}:${PORT}`);
});
