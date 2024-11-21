const express = require("express");
const router = express.Router();
const adminController = require("../controllers/controllers.admin");
const {
  authenticateToken,
  authorizeRole,
} = require("../middlewares/authMiddleware");

router.use(authenticateToken);
router.use(authorizeRole(["ADMIN"]));

router.get("/banners", adminController.getBanner);
router.post("/banner", adminController.createBanner);
router.put("/banner/:id", adminController.createBanner);
router.delete("/banner/:id", adminController.deleteBanner);

router.get("/achievements", adminController.getAchievement);
router.post("/achievement", adminController.createAchievement);
router.put("/achievement/:id", adminController.createAchievement);
router.delete("/achievement/:id", adminController.deleteAchievement);

router.get("/users", adminController.getUser);
router.post("/user", adminController.createUser);
router.put("/user/:id", adminController.createUser);
router.delete("/user/:id", adminController.deleteUser);

router.get("/courses", adminController.getCourse);
router.post("/course", adminController.createCourse);
router.put("/course/:id", adminController.createCourse);
router.delete("/course/:id", adminController.deleteCourse);

router.get("/topics", adminController.getTopic);
router.post("/topic", adminController.createTopic);
router.put("/topic/:id", adminController.createTopic);
router.delete("/topic/:id", adminController.deleteTopic);

router.get("/lessons", adminController.getLesson);
router.post("/lesson", adminController.createLesson);
router.put("/lesson/:id", adminController.createLesson);
router.delete("/lesson/:id", adminController.deleteLesson);

router.get("/videos", adminController.getVideo);
router.post("/video", adminController.createVideo);
router.put("/video/:id", adminController.createVideo);
router.delete("/video/:id", adminController.deleteVideo);

router.get("/students", adminController.getStudent);
router.post("/student", adminController.createStudent);
router.put("/student/:id", adminController.createStudent);
router.delete("/student/:id", adminController.deleteStudent);

router.get("/exams", adminController.getExam);
router.post("/exam", adminController.createExam);
router.put("/exam/:id", adminController.createExam);
router.delete("/exam/:id", adminController.deleteExam);

router.get("/overviews", adminController.getOverview);
router.post("/overview", adminController.createOverview);
router.put("/overview/:id", adminController.createOverview);
router.delete("/overview/:id", adminController.deleteOverview);

router.get("/describes", adminController.getDescribe);
router.post("/describe", adminController.createDescribe);
router.put("/describe/:id", adminController.createDescribe);
router.delete("/describe/:id", adminController.deleteDescribe);

router.get("/orders", adminController.getOrder);
router.post("/order", adminController.createOrder);
router.put("/order/:id", adminController.createOrder);
router.delete("/order/:id", adminController.deleteOrder);

router.post("/comments", adminController.createComment);
router.put("/comment/:id", adminController.createComment);
router.delete("/comment/:id", adminController.deleteComment);

router.post("/rates", adminController.createRate);
router.put("/rate/:id", adminController.createRate);
router.delete("/rate/:id", adminController.deleteRate);

module.exports = router;
