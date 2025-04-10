const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    userAddress: { type: String, required: true },
    
    // Pet and booking details
    petName: { type: String, required: true },
    ownerName: { type: String, required: true },
    petAge: { type: String },  // Optional
    phone: { type: String, required: true },
    
    schedule: { type: String, required: true },
    status: { type: String, default: "pending", enum: ["pending", "confirmed", "canceled", "completed"] },
    
    hospitalInfo: {
        name: { type: String },
        address: { type: String },
        phone: { type: String },
        email: { type: String },
        hours: { type: String }
    },
    notificationSent: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Slot", slotSchema);
