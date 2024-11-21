const express = require("express");
const router = express.Router();
const adminController = require("../controllers/controllers.admin");
const {
  authenticateToken,
  authorizeRole,
} = require("../middlewares/authMiddleware");

router.use(authenticateToken);
router.use(authorizeRole(["ADMIN"]));

router.get("/banners", adminController.getBanners);
router.post("/banner", adminController.createBanner);
router.put("/banner/:id", adminController.updateBanner);
router.delete("/banner/:id", adminController.deleteBanner);

router.get("/achievements", adminController.getAchievements);
router.post("/achievement", adminController.createAchievement);
router.put("/achievement/:id", adminController.updateAchievement);
router.delete("/achievement/:id", adminController.deleteAchievement);

router.get("/users", adminController.getUsers);
router.post("/user", adminController.createUser);
router.put("/user/:id", adminController.updateUser);
router.delete("/user/:id", adminController.deleteUser);

router.get("/courses", adminController.getCourses);
router.post("/course", adminController.createCourse);
router.put("/course/:id", adminController.updateCourse);
router.delete("/course/:id", adminController.deleteCourse);

router.get("/topics", adminController.getTopics);
router.post("/topic", adminController.createTopic);
router.put("/topic/:id", adminController.updateTopic);
router.delete("/topic/:id", adminController.deleteTopic);

router.get("/lessons", adminController.getLessons);
router.post("/lesson", adminController.createLesson);
router.put("/lesson/:id", adminController.updateLesson);
router.delete("/lesson/:id", adminController.deleteLesson);

router.get("/students", adminController.getStudents);
router.post("/student", adminController.createStudent);
router.put("/student/:id", adminController.updateStudent);
router.delete("/student/:id", adminController.deleteStudent);

router.get("/exams", adminController.getExams);
router.post("/exam", adminController.createExam);
router.put("/exam/:id", adminController.updateExam);
router.delete("/exam/:id", adminController.deleteExam);

router.get("/overviews", adminController.getOverviews);
router.post("/overview", adminController.createOverview);
router.put("/overview/:id", adminController.updateOverview);
router.delete("/overview/:id", adminController.deleteOverview);

router.get("/describes", adminController.getDescribes);
router.post("/describe", adminController.createDescribe);
router.put("/describe/:id", adminController.updateDescribe);
router.delete("/describe/:id", adminController.deleteDescribe);

router.get("/orders", adminController.getOrders);
router.post("/order", adminController.createOrder);
router.put("/order/:id", adminController.updateOrder);
router.delete("/order/:id", adminController.deleteOrder);

router.post("/comment", adminController.createComment);
router.put("/comment/:id", adminController.updateComment);
router.delete("/comment/:id", adminController.deleteComment);

router.post("/rate", adminController.createRate);
router.put("/rate/:id", adminController.updateRate);
router.delete("/rate/:id", adminController.deleteRate);

module.exports = router;
