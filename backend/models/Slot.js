const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    userAddress: { type: String, required: true },
    schedule: { type: String, required: true },
    status: { type: String, default: "booked" },
});

module.exports = mongoose.model("Slot", slotSchema);
