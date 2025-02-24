const User = require('../models/User');

// Get all users except the currently logged in user
const getAllUsers = async (req, res) => {
    try {
        // Exclude password field and fetch all users except current user
        const users = await User.find(
            { _id: { $ne: req.user.userId } }, // Use req.user.id to exclude the logged-in user
            { password: 0 }
        );
        
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ msg: "Server error" });
    }
};

module.exports = {
    getAllUsers
}; 