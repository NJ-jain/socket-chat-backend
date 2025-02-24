const express = require("express");
const { getChatHistory, storeMessage } = require("../controllers/personalMessageController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Route to get chat history between two users
router.get("/:partnerId", authMiddleware, getChatHistory);

// Route to store a new message
router.post("/", authMiddleware, storeMessage);

module.exports = router; 