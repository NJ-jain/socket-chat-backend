const Message = require("../models/Message.js");

// Get all messages
const getMessages = async (req, res) => {
    try {
        const messages = await Message.find()
            .populate('sender', 'username email')
            .sort({ createdAt: -1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Save new message
const addMessage = async (req, res) => {
    try {
        const { text } = req.body;
        const message = new Message({
            sender: req.user.userId,  // From auth middleware
            text
        });
        await message.save();
        
        const populatedMessage = await Message.findById(message._id)
            .populate('sender', 'username email');
            
        res.status(201).json(populatedMessage);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getMessages, addMessage };