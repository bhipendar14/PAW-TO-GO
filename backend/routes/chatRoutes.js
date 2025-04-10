const express = require("express");
const router = express.Router();
const Chat = require("../models/Chat");
const Message = require("../models/Message");
const User = require("../models/User");

// Get chat history between two users
router.get("/:userId/:receiverId", async (req, res) => {
  try {
    const { userId, receiverId } = req.params;
    
    if (!userId || !receiverId) {
      return res.status(400).json({ error: "User IDs missing" });
    }

    // Find or create chat
    let chat = await Chat.findOne({
      participants: { $all: [userId, receiverId] }
    });

    if (!chat) {
      // If chat doesn't exist, create a new one
      chat = new Chat({
        participants: [userId, receiverId],
        messages: []
      });
      await chat.save();
      return res.json({ chat, messages: [] });
    }

    // Find messages for this chat
    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: receiverId },
        { senderId: receiverId, receiverId: userId }
      ]
    }).sort({ createdAt: 1 });

    res.json({ chat, messages });
  } catch (error) {
    console.error("Error getting chat history:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get all chats for a user
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Find all chats where the user is a participant
    const chats = await Chat.find({
      participants: userId
    });

    // Get the details of the other participants in each chat
    const chatWithDetails = await Promise.all(chats.map(async (chat) => {
      // Find the other participant in the chat
      const otherParticipantId = chat.participants.find(id => id.toString() !== userId);
      
      // Get user details of the other participant
      const otherParticipant = await User.findById(otherParticipantId).select('-password');
      
      // Get the last message in the chat
      const lastMessage = await Message.findOne({
        $or: [
          { senderId: userId, receiverId: otherParticipantId },
          { senderId: otherParticipantId, receiverId: userId }
        ]
      }).sort({ createdAt: -1 });

      return {
        _id: chat._id,
        participant: otherParticipant,
        lastMessage: lastMessage || { message: "No messages yet" },
        updatedAt: lastMessage ? lastMessage.createdAt : chat.createdAt
      };
    }));

    // Sort chats by last message time (newest first)
    chatWithDetails.sort((a, b) => b.updatedAt - a.updatedAt);

    res.json(chatWithDetails);
  } catch (error) {
    console.error("Error getting user chats:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get messages for a customer
router.get('/customer/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        if (!userId) return res.status(400).json({ error: "User ID missing" });

        const messages = await Message.find({
            $or: [
                { senderId: userId },
                { receiverId: userId }
            ]
        }).sort({ timestamp: 1 });

        // Always return a messages array (even if empty)
        res.json({ messages: messages || [] });
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ error: "Failed to fetch messages" });
    }
});

// Get messages for an employee (all customer messages + employee's sent messages)
router.get('/employee/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        if (!userId) return res.status(400).json({ error: "User ID missing" });

        const messages = await Message.find({
            $or: [
                { senderRole: "user" },
                { senderId: userId }
            ]
        }).sort({ timestamp: 1 });

        // Always return a messages array (even if empty)
        res.json({ messages: messages || [] });
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ error: "Failed to fetch messages" });
    }
});

// Send a new message
router.post('/message', async (req, res) => {
    try {
        const { senderId, senderName, senderRole, receiverId, message } = req.body;
        
        if (!senderId || !message) {
            return res.status(400).json({ error: "Missing required fields", details: req.body });
        }

        const newMessage = new Message({
            senderId,
            senderName: senderName || 'Unknown User',
            senderRole: senderRole || 'user',
            receiverId: receiverId || 'employee',
            message,
            timestamp: new Date()
        });
        
        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (error) {
        console.error("Error saving message:", error);
        res.status(500).json({ error: "Failed to save message", details: error.message });
    }
});

// Mark messages as read
router.put("/read/:senderId/:receiverId", async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;
    
    // Update all unread messages from sender to receiver
    const result = await Message.updateMany(
      { senderId, receiverId, read: false },
      { $set: { read: true } }
    );

    res.json({ message: "Messages marked as read", count: result.modifiedCount });
  } catch (error) {
    console.error("Error marking messages as read:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;