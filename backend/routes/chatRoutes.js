const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

// Get messages for a specific chat
router.get("/:chatId", async (req, res) => {
  try {
    const messages = await Message.find({ chatId: req.params.chatId }).sort({ createdAt: 1 });
    res.json({ messages });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

module.exports = router;
