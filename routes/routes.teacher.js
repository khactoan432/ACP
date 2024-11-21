const express = require("express");
const router = express.Router();
const teacherController = require("../controllers/controllers.teacher");
const {
  authenticateToken,
  authorizeRole,
} = require("../middlewares/authMiddleware");

router.use(authenticateToken);
router.use(authorizeRole(["ADMIN", "TEACHER"]));

// router.get("/", teacherController.getAllTeachers);
// router.post("/", teacherController.createTeacher);
// router.get("/:id", teacherController.getTeacherById);
// router.put("/:id", teacherController.updateTeacher);
// router.delete("/:id", teacherController.deleteTeacher);

module.exports = router;
