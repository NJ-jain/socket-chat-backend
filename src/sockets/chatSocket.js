const socketIo = require("socket.io");
const Message = require("../models/Message"); // Import Message Model for group chat
const PersonalMessage = require("../models/PersonalMessages"); // Import PersonalMessage Model for personal chat

const setupSocket = (server) => {
    const io = socketIo(server, {
        cors: {
    origin: process.env.FRONTEND_URL, // Allow requests from the frontend (React app)
            methods: ["GET", "POST"]
        },
        transports: ["websocket", "polling"] // Ensure WebSocket support
    });

    io.on("connection", (socket) => {
        console.log("New user connected:", socket.id);

        // Group chat message handling
        socket.on("sendMessage", async (data) => {
            try {
                console.log(data);
                // Save message to database
                const newMessage = new Message({
                    sender: data.senderId,
                    text: data.text
                });
                await newMessage.save();
                
                // Populate the sender information before broadcasting
                const populatedMessage = await Message.findById(newMessage._id)
                    .populate('sender', 'username email'); // Add the fields you want to populate
                
                console.log(populatedMessage);
                // Broadcast populated message to all clients
                io.emit("receiveMessage", populatedMessage);
            } catch (error) {
                console.error("Error saving message:", error);
            }
        });

        // Personal chat room joining
        socket.on("joinRoom", ({ userId, partnerId }) => {
            const roomId = [userId, partnerId].sort().join("-");
            socket.join(roomId);
            console.log(`User ${userId} joined room ${roomId}`);
        });

        // Personal chat message handling
        socket.on("sendPersonalMessage", async (data) => {
            try {
                const newMessage = new PersonalMessage({
                    sender: data.senderId,
                    receiver: data.receiverId,
                    text: data.text
                });
                await newMessage.save();

                const populatedMessage = await PersonalMessage.findById(newMessage._id)
                    .populate('sender', 'username email')
                    .populate('receiver', 'username email');

                const roomId = [data.senderId, data.receiverId].sort().join("-");
                io.to(roomId).emit("receivePersonalMessage", populatedMessage);
            } catch (error) {
                console.error("Error saving personal message:", error);
            }
        });

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });
};

module.exports = { setupSocket };