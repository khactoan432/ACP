const express = require("express");
const router = express.Router();

// Example route
router.get("/", (req, res) => {
  res.send("Welcome to the Backend Server!");
});

module.exports = router;
