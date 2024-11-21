const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controllers");

router.register("/register", authController.registerController);
router.login("/login", authController.loginController);
router.logout("/logout", authController.logoutController);

module.exports = router;
