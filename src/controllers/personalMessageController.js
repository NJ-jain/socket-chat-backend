const PersonalMessage = require("../models/PersonalMessages");

// Get chat history between two users
const getChatHistory = async (req, res) => {
    const { userId } = req.user;
    const { partnerId } = req.params;

    try {
        const messages = await PersonalMessage.find({
            $or: [
                { sender: userId, receiver: partnerId },
                { sender: partnerId, receiver: userId }
            ]
        })
        .sort({ createdAt: 1 })
        .populate('sender', 'username email') // Adjust fields as needed
        .populate('receiver', 'username email'); // Adjust fields as needed

        res.json(messages);
    } catch (error) {
        res.status(500).json({ msg: "Server error" });
    }
};


// Store a new message
const storeMessage = async (req, res) => {
    const { userId } = req.user;
    const { receiverId, text } = req.body;

    try {
        const newMessage = new PersonalMessage({
            sender: userId,
            receiver: receiverId,
            text
        });

        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ msg: "Server error" });
    }
};

module.exports = {
    getChatHistory,
    storeMessage
}; 