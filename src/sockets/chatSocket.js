const socketIo = require("socket.io");
const Message = require("../models/Message"); // Import Message Model

const setupSocket = (server) => {
    const io = socketIo(server, {
        cors: {
            origin: ["http://localhost:3000", "https://your-frontend.com"],
            methods: ["GET", "POST"]
        },
        transports: ["websocket", "polling"] // Ensure WebSocket support
    });

    io.on("connection", (socket) => {
        console.log("New user connected:", socket.id);

        // Listen for messages
        socket.on("sendMessage", async (data) => {
            try {
                console.log(data)
                // Save message to database
                const newMessage = new Message({
                    sender: data.senderId,
                    text: data.text
                });
                await newMessage.save();
                
                // Populate the sender information before broadcasting
                const populatedMessage = await Message.findById(newMessage._id)
                    .populate('sender', 'username email'); // Add the fields you want to populate
                
                console.log(populatedMessage)
                // Broadcast populated message to all clients
                io.emit("receiveMessage", populatedMessage);
            } catch (error) {
                console.error("Error saving message:", error);
            }
        });

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });
};

module.exports = { setupSocket };
