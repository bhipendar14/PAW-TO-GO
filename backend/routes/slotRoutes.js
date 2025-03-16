const express = require("express");
const router = express.Router();
const Slot = require("../models/Slot");
const User = require("../models/User");

// ✅ Book a Slot
router.post("/book", async (req, res) => {
    try {
        console.log("📥 Booking Request Data:", req.body);

        const { userId, schedule } = req.body;

        if (!userId || !schedule) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // ✅ Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // ✅ Save slot booking
        const newSlot = new Slot({
            userId,
            userName: user.name,
            userEmail: user.email,
            userAddress: user.address,
            schedule,
            status: "booked"
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

        // Find the slot and update the status to "confirmed"
        const updatedSlot = await Slot.findByIdAndUpdate(
            slotId,
            { status: "confirmed" },
            { new: true } // Return the updated slot
        );

        if (!updatedSlot) {
            return res.status(404).json({ message: "Slot not found" });
        }

        res.json({ message: "Slot confirmed successfully", slot: updatedSlot });
    } catch (error) {
        console.error("Error confirming slot:", error);
        res.status(500).json({ error: "Internal Server Error" });
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
