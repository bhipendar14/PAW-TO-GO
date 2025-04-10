const express = require("express");
const router = express.Router();
const Slot = require("../models/Slot");
const User = require("../models/User");
const sendEmail = require("../utils/emailSender");

// ✅ Book a Slot
router.post("/book", async (req, res) => {
    try {
        console.log("📥 Booking Request Data:", req.body);

        const { userId, schedule, petName, ownerName, phone } = req.body;

        if (!userId || !schedule || !petName || !ownerName || !phone) {
            console.log("❌ Missing required fields:", { userId, schedule, petName, ownerName, phone });
            return res.status(400).json({ error: "Missing required fields" });
        }

        // ✅ Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            console.log("❌ User not found for ID:", userId);
            return res.status(404).json({ error: "User not found" });
        }

        // ✅ Save slot booking
        const newSlot = new Slot({
            userId,
            userName: req.body.userName || user.name,
            userEmail: req.body.userEmail || user.email,
            userAddress: req.body.userAddress || user.address || "No Address",
            schedule,
            petName,
            ownerName,
            petAge: req.body.petAge || "",
            phone,
            status: "pending"
        });

        await newSlot.save();
        console.log("✅ Slot booked successfully:", newSlot);

        res.status(201).json({ message: "Slot booked successfully", slot: newSlot });
    } catch (error) {
        console.error("❌ Error booking slot:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// ✅ Get All Bookings
router.get("/bookings", async (req, res) => {
    try {
        const bookings = await Slot.find();
        res.json(bookings);
    } catch (error) {
        console.error("Error fetching bookings:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// ✅ Get User's Bookings
router.get("/user/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const bookings = await Slot.find({ userId });
        res.json(bookings);
    } catch (error) {
        console.error("Error fetching user bookings:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// ✅ Mark notification as shown
router.put("/notification/:slotId", async (req, res) => {
    try {
        const { slotId } = req.params;
        
        // Update notification status to true
        const updatedSlot = await Slot.findByIdAndUpdate(
            slotId,
            { notificationSent: true },
            { new: true }
        );

        if (!updatedSlot) {
            return res.status(404).json({ message: "Slot not found" });
        }

        res.json({ message: "Notification marked as shown", slot: updatedSlot });
    } catch (error) {
        console.error("Error updating notification status:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// ✅ Cancel Booking
router.delete("/cancel/:slotId", async (req, res) => {
    try {
        const { slotId } = req.params;
        const deletedSlot = await Slot.findByIdAndDelete(slotId);
        
        if (!deletedSlot) {
            return res.status(404).json({ message: "Slot not found" });
        }

        res.json({ message: "Slot booking canceled successfully" });
    } catch (error) {
        console.error("Error canceling booking:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// ✅ Confirm a Slot
router.put("/confirm/:slotId", async (req, res) => {
    try {
        const { slotId } = req.params;
        const { hospitalInfo } = req.body;

        const slot = await Slot.findById(slotId);
        if (!slot) {
            return res.status(404).json({ message: "Slot not found" });
        }

        // Update the slot status and hospital info
        slot.status = "confirmed";
        if (hospitalInfo) {
            slot.hospitalInfo = hospitalInfo;
        }
        
        // Set notification as not shown yet
        slot.notificationSent = false;
        
        await slot.save();
        
        // Send email notification
        if (sendEmail && typeof sendEmail === 'function') {
            const emailData = {
                to: slot.userEmail,
                subject: "Appointment Confirmed!",
                text: `Hello ${slot.userName}, your appointment on ${slot.schedule} has been confirmed.`,
                html: `
                    <h3>Hello ${slot.userName},</h3>
                    <p>Your appointment on ${slot.schedule} has been confirmed.</p>
                    ${hospitalInfo ? `
                    <h4>Hospital Information:</h4>
                    <p>Name: ${hospitalInfo.name || 'N/A'}</p>
                    <p>Address: ${hospitalInfo.address || 'N/A'}</p>
                    <p>Phone: ${hospitalInfo.phone || 'N/A'}</p>
                    <p>Email: ${hospitalInfo.email || 'N/A'}</p>
                    <p>Hours: ${hospitalInfo.hours || 'N/A'}</p>
                    ` : ''}
                    <p>Thank you for using our service!</p>
                `
            };
            sendEmail(emailData);
        }
        
        res.status(200).json({ message: "Slot confirmed successfully" });
    } catch (error) {
        console.error("Error confirming slot:", error);
        res.status(500).json({ message: "Error confirming slot" });
    }
});


// ✅ Cancel Slot (Update status instead of deleting)
router.put("/cancel/:slotId", async (req, res) => {
    try {
        const { slotId } = req.params;
        
        // Update slot status to "canceled"
        const updatedSlot = await Slot.findByIdAndUpdate(
            slotId,
            { status: "canceled" },
            { new: true }
        );

        if (!updatedSlot) {
            return res.status(404).json({ message: "Slot not found" });
        }

        res.json({ message: "Slot canceled successfully", slot: updatedSlot });
    } catch (error) {
        console.error("Error canceling slot:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


module.exports = router;
