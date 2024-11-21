const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controllers");

router.get("/courses", userController.getCourse);
router.get("/exams", userController.getExam);

router.get("/order-course", userController.getOrderCourse);
router.post("/order-course", userController.createOrderCourse);

router.get("/order-exam", userController.getOrderExam);
router.post("/order-exam", userController.createOrderExam);

router.post("/comments", userController.createComment);
router.put("/comment", userController.updateComment);
router.delete("/comment", userController.deleteComment);

router.post("/rates", userController.createRate);
router.put("/rate", userController.updateRate);
router.delete("/rate", userController.deleteRate);

router.get("/infors", userController.getInfor);
router.put("/infor", userController.updateInfor);

router.get("/rank", userController.getRank);
router.get("/score", userController.getScore);

module.exports = router;
