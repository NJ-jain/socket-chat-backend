const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

// @desc     Register a new user
exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: "User already exists" });

        // Create a new user
        user = new User({ username, email, password });
        await user.save();

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.status(201).json({
            token,
            user: { _id: user._id, username: user.username, email: user.email },
            msg: "User registered successfully"
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc     Login user and return JWT
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: "Invalid credentials" });

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.json({ token, user: { _id: user._id, username: user.username, email: user.email } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};