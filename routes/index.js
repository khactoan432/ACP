const express = require("express");
const router = express.Router();

// Import các route con
const userRoutes = require("./routes.user");
const teacherRoutes = require("./routes.teacher");
const adminRoutes = require("./routes.admin");
const indexController = require("../controllers/index");
const authRoutes = require("./routes.auth");

// Định nghĩa các nhóm API
router.use("/users", userRoutes);
router.use("/teachers", teacherRoutes);
router.use("/admin", adminRoutes);
router.use("/auth", authRoutes);

//get comments by id cource (limit or all)
router.get("/comments/:id", indexController.getComments);
//get rates by id cource
router.get("/rates/:id", indexController.getRates);
// get six lastest banner
router.get("/banner", indexController.getBanners);
//get six achievements latest
router.get("/achievements", indexController.getAchievements);
//get cources (limit or all or only)
router.get("/courses/:id?", indexController.getCourses);
// get topics by cource
router.get("/topics/:id", indexController.getTopics);
// get lessons by topic
router.get("/lessons", indexController.getLessons);
//get exems (limit or all)
router.get("/exams", indexController.getExams);

module.exports = router;

// Example route
router.get("/", (req, res) => {
  res.send("Welcome to the Backend Server!");
});

module.exports = router;
