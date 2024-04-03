const router = require("express").Router;

router.post("/mainFormCreate", async (req, res) => {
  try {
    const { id, title, multtipleEntry, description } = req.body;
    if (title == "" || multtipleEntry == "" || description == "") {
      return res.status(400).json("Please provide all required fields");
    }
  } catch (error) {
    res.status(error);
  }
});
