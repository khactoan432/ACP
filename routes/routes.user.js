const express = require("express");
const router = express.Router();
const userController = require("../controllers/controllers.user");
const {
  authenticateToken,
  authorizeRole,
} = require("../middlewares/authMiddleware");

router.use(authenticateToken);
router.use(authorizeRole(["USER", "ADMIN", "TEACHER"]));

router.get("/courses", userController.getCourses);
router.get("/exams", userController.getExams);

router.get("/order-course", userController.getOrderCourse);
router.post("/order-course", userController.createOrderCourse);

router.get("/order-exam", userController.getOrderExam);
router.post("/order-exam", userController.createOrderExam);

router.post("/comments", userController.createComment);
router.put("/comment/:id", userController.updateComment);
router.delete("/comment/:id", userController.deleteComment);

router.post("/rate", userController.createRate);
router.put("/rate/:id", userController.updateRate);
router.delete("/rate/:id", userController.deleteRate);

router.get("/infor", userController.getInfor);
router.put("/infor/:id", userController.updateInfor);

router.get("/rank", userController.getRank);
router.get("/score", userController.getScore);

module.exports = router;
