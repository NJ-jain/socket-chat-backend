const express = require("express");
const authController = require("../controllers/authController.js");

const router = express.Router();

// @route    POST /api/auth/register
router.post("/register", authController.register);

// @route    POST /api/auth/login
router.post("/login", authController.login);

module.exports = router;