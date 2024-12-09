const express = require("express");
const router = express.Router();

// Import các route con
const userRoutes = require("./routes.user");
const teacherRoutes = require("./routes.teacher");
const adminRoutes = require("./routes.admin");
const authRoutes = require("./routes.auth");
const upload = require("./routes.upload");

const indexController = require("../controllers/index");

// Định nghĩa các nhóm API
router.use("/users", userRoutes);
router.use("/teachers", teacherRoutes);
router.use("/admin", adminRoutes);
router.use("/auth", authRoutes);
router.use("/upload", upload);

router.get("/comments", indexController.getComments);
router.get("/rates", indexController.getRates);
router.get("/banner", indexController.getBanners);
router.get("/achievements", indexController.getAchievements);
router.get("/courses", indexController.getCourses);
router.get("/topics", indexController.getTopics);
router.get("/lessons", indexController.getLessons);
router.get("/exams", indexController.getExams);

module.exports = router;

// Example route
router.get("/", (req, res) => {
  res.send("Welcome to the Backend Server!");
});

module.exports = router;
