const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controllers");

router.get("/course", userController.getCourse);
router.get("/exam", userController.getExam);

router.get("/order-course", userController.getOrderCourse);
router.post("/order-course", userController.createOrderCourse);

router.get("/order-exam", userController.getOrderExam);
router.post("/order-exam", userController.createOrderExam);

router.post("/comment", userController.createComment);
router.put("/comment", userController.updateComment);
router.delete("/comment", userController.deleteComment);

router.post("/rate", userController.createRate);
router.put("/rate", userController.updateRate);
router.delete("/rate", userController.deleteRate);

router.get("/infor", userController.getInfor);
router.put("/infor", userController.updateInfor);

router.get("/rank", userController.getRank);
router.get("/score", userController.getScore);

module.exports = router;
