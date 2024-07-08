require("dotenv").config();
const express = require("express");
const cors = require("cors");
const config = require("./configurations/config");
const index_endpoint = require("./endpoints/index_endpoint");
const session = require("express-session");
const mySQLStore = require("express-mysql-session")(session);
const cookieParser = require("cookie-parser");

const path = require("path");
const fs = require("fs");

const app = express();
let options = {
  host: config.HOST,
  port: config.DB_PORT,
  user: config.USER,
  password: config.PASSWORD,
  database: config.DATABASE,
};

let sessionStore = new mySQLStore(options);
PORT = config.PORT || 2000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "500mb" }));
app.use(cookieParser());

app.use(
  session({
    key: config.LOGIN_KEY,
    secret: config.LOGIN_SECRET_KEY,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 24 hours
  })
);

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

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is listening on http://0.0.0.0:${PORT}`);
});
