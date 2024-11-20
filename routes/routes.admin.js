const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controllers");

router.get("/banner", adminController.getBanner);
router.post("/banner", adminController.createBanner);
router.put("/banner/:id", adminController.putBanner);
router.delete("/banner/:id", adminController.deleteBanner);

router.get("/achievement", adminController.getAchievement);
router.post("/achievement", adminController.createAchievement);
router.put("/achievement/:id", adminController.putAchievement);
router.delete("/achievement/:id", adminController.deleteAchievement);

router.get("/user", adminController.getUser);
router.post("/user", adminController.createUser);
router.put("/user/:id", adminController.putUser);
router.delete("/user/:id", adminController.deleteUser);

router.get("/course", adminController.getCourse);
router.post("/course", adminController.createCourse);
router.put("/course/:id", adminController.putCourse);
router.delete("/course/:id", adminController.deleteCourse);

router.get("/topic", adminController.getTopic);
router.post("/topic", adminController.createTopic);
router.put("/topic/:id", adminController.putTopic);
router.delete("/topic/:id", adminController.deleteTopic);

router.get("/lesson", adminController.getLesson);
router.post("/lesson", adminController.createLesson);
router.put("/lesson/:id", adminController.putLesson);
router.delete("/lesson/:id", adminController.deleteLesson);

router.get("/video", adminController.getVideo);
router.post("/video", adminController.createVideo);
router.put("/video/:id", adminController.putVideo);
router.delete("/video/:id", adminController.deleteVideo);

router.get("/student", adminController.getStudent);
router.post("/student", adminController.createStudent);
router.put("/student/:id", adminController.putStudent);
router.delete("/student/:id", adminController.deleteStudent);

router.get("/exam", adminController.getExam);
router.post("/exam", adminController.createExam);
router.put("/exam/:id", adminController.putExam);
router.delete("/exam/:id", adminController.deleteExam);

router.get("/overview", adminController.getOverview);
router.post("/overview", adminController.createOverview);
router.put("/overview/:id", adminController.putOverview);
router.delete("/overview/:id", adminController.deleteOverview);

router.get("/describe", adminController.getDescribe);
router.post("/describe", adminController.createDescribe);
router.put("/describe/:id", adminController.putDescribe);
router.delete("/describe/:id", adminController.deleteDescribe);

router.get("/order", adminController.getOrder);
router.post("/order", adminController.createOrder);
router.put("/order/:id", adminController.putOrder);
router.delete("/order/:id", adminController.deleteOrder);

router.post("/comment", adminController.createComment);
router.put("/comment/:id", adminController.putComment);
router.delete("/comment/:id", adminController.deleteComment);

router.post("/rate", adminController.createRate);
router.put("/rate/:id", adminController.putRate);
router.delete("/rate/:id", adminController.deleteRate);

module.exports = router;
