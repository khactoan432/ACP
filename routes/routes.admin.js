const express = require("express");
const multer = require("multer");
const router = express.Router();
const adminController = require("../controllers/controllers.admin");
const {
  authenticateToken,
  authorizeRole,
} = require("../middlewares/authMiddleware");

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.fieldname === "fileImage" && !file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed for fileImage"));
    }
    if (file.fieldname === "fileVideo" && !file.mimetype.startsWith("video/")) {
      return cb(new Error("Only video files are allowed for fileVideo"));
    }
    cb(null, true);
  },
});

const uploadFields = upload.fields([
  { name: "fileImage" },
  { name: "fileVideo" },
]);

router.use(authenticateToken);
router.use(authorizeRole(["ADMIN"]));

router.get("/banners", adminController.getBanners);
router.post("/banner", upload.array("files"), adminController.createBanner);
router.put("/banner/:id", upload.array("files"), adminController.updateBanner);
router.delete("/banner/:id", adminController.deleteBanner);

router.get("/achievements", adminController.getAchievements);
router.post(
  "/achievement",
  upload.array("files"),
  adminController.createAchievement
);
router.put(
  "/achievement/:id",
  upload.array("files"),
  adminController.updateAchievement
);
router.delete("/achievement/:id", adminController.deleteAchievement);

router.get("/users", adminController.getUsers);
router.post("/user", upload.array("files"), adminController.createUser);
router.put("/user/:id", upload.array("files"), adminController.updateUser);
router.delete("/user/:id", adminController.deleteUser);

router.get("/courses", adminController.getCourses);
router.post("/course", uploadFields, adminController.createCourse);
router.put("/course/:id", uploadFields, adminController.updateCourse);
router.delete("/course/:id", adminController.deleteCourse);

//course detail
router.get("/course-detail/:id", adminController.getCourseDetail);

router.get("/topics", adminController.getTopics);
router.post("/topic", adminController.createTopic);
router.put("/topic/:id", adminController.updateTopic);
router.delete("/topic/:id", adminController.deleteTopic);

router.get("/lessons", adminController.getLessons);
router.post("/lesson", uploadFields, adminController.createLesson);
router.put("/lesson/:id", uploadFields, adminController.updateLesson);
router.delete("/lesson/:id", adminController.deleteLesson);

// router.get("/exercise", adminController.getExercise);
router.post("/exercise", adminController.createExercise);
router.put("/exercise/:id", adminController.updateExercise);
router.delete("/exercise/:id", adminController.deleteExercise);

router.get("/registers", adminController.getRegisters);
router.post("/register", adminController.createRegister);
router.put("/register/:id", adminController.updateRegister);
router.delete("/register/:id", adminController.deleteRegister);

router.get("/exams", adminController.getExams);
router.post("/exam", uploadFields, adminController.createExam);
router.put("/exam/:id", uploadFields, adminController.updateExam);
router.delete("/exam/:id", adminController.deleteExam);

router.get("/exam/videos", adminController.getExamVideos);
router.post("/exam/video/:id", uploadFields, adminController.createExamVideo);
router.put("/exam/video/:id", uploadFields, adminController.updateExamVideo);
router.delete("/exam/video/:id", adminController.deleteExamVideo);

router.get("/overviews", adminController.getOverviews);
router.post("/overview", adminController.createOverview);
router.put("/overview/:id", adminController.updateOverview);
router.delete("/overview/:id", adminController.deleteOverview);

router.get("/describes/:id", adminController.getDescribes);
router.post("/describe", adminController.createDescribe);
router.put("/describe/:id", adminController.updateDescribe);
router.delete("/describe/:id", adminController.deleteDescribe);

router.get("/orders", adminController.getOrders);
router.put("/order/:id", adminController.updateOrder);
router.delete("/order/:id", adminController.deleteOrder);

router.post("/comment", adminController.createComment);
router.put("/comment/:id", adminController.updateComment);
router.delete("/comment/:id", adminController.deleteComment);

router.post("/rate", adminController.createRate);
router.put("/rate/:id", adminController.updateRate);
router.delete("/rate/:id", adminController.deleteRate);

// categories
router.get("/categories", adminController.getCategories);
router.post("/categories", adminController.createCategories);
router.put("/categories/:id", adminController.updateCategories);
router.put("/category/:id", adminController.updateCategory);
router.delete("/category/:id", adminController.deleteCategory);
router.delete("/categoryType/:id", adminController.deleteCategoryType);

module.exports = router;
