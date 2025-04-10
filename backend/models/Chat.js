const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    participants: [{
      type: String,
      required: true
    }],
    messages: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message"
    }],
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message"
    },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat; 