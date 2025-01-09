const express = require("express");
const router = express.Router();

// Import các route con
const userRoutes = require("./routes.user");
const teacherRoutes = require("./routes.teacher");
const adminRoutes = require("./routes.admin");
const authRoutes = require("./routes.auth");
const upload = require("./routes.upload");
const payment = require("./routes.payment");

const indexController = require("../controllers/index");

// Định nghĩa các nhóm API
router.use("/user", userRoutes);
router.use("/teacher", teacherRoutes);
router.use("/admin", adminRoutes);
router.use("/auth", authRoutes);
router.use("/upload", upload);
router.use("/payment", payment);

router.get("/comments", indexController.getComments);
router.get("/rates", indexController.getRates);
router.get("/banners", indexController.getBanners);
router.get("/users", indexController.getUsers);
router.get("/achievements", indexController.getAchievements);
router.get("/courses", indexController.getCourses);
router.get("/course/:id", indexController.getCourseDetail);
router.get("/topics", indexController.getTopics);
router.get("/lessons", indexController.getLessons);
router.get("/exams", indexController.getExams);

// advisory user
router.post("/advisories", indexController.createAdvisory);

module.exports = router;

// Example route
router.get("/", (req, res) => {
  res.send("Welcome to the Backend Server!");
});

module.exports = router;
