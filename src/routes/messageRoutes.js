const express = require("express");
const { getMessages, addMessage } = require("../controllers/messageController.js");
const authMiddleware = require("../middleware/authMiddleware.js");
const router = express.Router();

router.get("/", authMiddleware, getMessages);
router.post("/",authMiddleware, addMessage);

module.exports = router;
