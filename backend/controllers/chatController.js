const Chat = require("../models/Chat");
const Message = require("../models/Message");
const User = require("../models/User");

exports.getEmployeeChats = async (req, res) => {
    try {
        const employeeId = req.user.id; // Assuming JWT middleware attaches user info

        // Find distinct users who have messaged the employee
        const userChats = await Message.find({ receiverId: employeeId })
            .distinct("senderId");

        // Fetch user details
        const users = await User.find({ _id: { $in: userChats } })
            .select("_id name email");

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error });
    }
};
