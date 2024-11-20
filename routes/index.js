const express = require("express");
const router = express.Router();

// Import các route con
const userRoutes = require("./routes.user");
const teacherRoutes = require("./routes.teacher");
const adminRoutes = require("./routes.admin");

// Định nghĩa các nhóm API
router.use("/users", userRoutes);
router.use("/teachers", teacherRoutes);
router.use("/admin", adminRoutes);

module.exports = router;

// Example route
router.get("/", (req, res) => {
  res.send("Welcome to the Backend Server!");
});

module.exports = router;
