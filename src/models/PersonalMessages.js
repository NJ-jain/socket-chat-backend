const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to User model
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to User model
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("PersonalMessage", messageSchema);