require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const connectDB = require("./src/config/db");
const { setupSocket } = require("./src/sockets/chatSocket.js");

const app = express();
const server = http.createServer(app);

// Connect to MongoDB
connectDB();

setupSocket(server);

app.use(cors({
    origin: ["http://localhost:3000"], // Allow requests from the frontend (React app)
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    credentials: true // Allow cookies or authentication headers
  }));
app.use(express.json());

// Routes
app.use("/api/auth", require("./src/routes/authRoutes.js")); // User auth
app.use("/api/messages", require("./src/routes/messageRoutes.js")); // Messages

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
