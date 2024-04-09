require("dotenv").config();
const express = require("express");
const cors = require("cors");
const config = require("./configurations/config");
const index_endpoint = require("./endpoints/index_endpoint");

const app = express();
PORT = config.PORT || 2000;

app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.use("/", index_endpoint);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
