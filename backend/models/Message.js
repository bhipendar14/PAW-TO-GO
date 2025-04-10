const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    chatId: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    // Primary fields for socket.io communication
    senderId: { type: String, required: true },
    receiverId: { type: String, required: true },
    senderName: { type: String, required: true },
    senderRole: { type: String, enum: ['user', 'employee', 'admin'], required: true },
    message: { type: String, required: true },
    // Optional fields
    fileUrl: { type: String, default: "" },
    read: { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

// Pre-save middleware to ensure senderId/receiverId are set
messageSchema.pre('save', function(next) {
  if (!this.senderId && this.sender) {
    this.senderId = this.sender.toString();
  }
  if (!this.receiverId && this.receiver) {
    this.receiverId = this.receiver.toString();
  }
  next();
});

module.exports = mongoose.model("Message", messageSchema); 