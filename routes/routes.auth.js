const express = require("express");
const router = express.Router();
const authController = require("../controllers/controllers.auth");

router.post("/register", authController.registerController);
router.post("/login", authController.loginController);
router.post("/logout", authController.logoutController);

module.exports = router;
