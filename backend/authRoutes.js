const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const User = require("../models/User"); // Ensure this model exists
const router = express.Router();

// Setup multer for identity proof uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Register User (Admin, Employee, or User)
router.post("/register", upload.single("identityProof"), async (req, res) => {
    try {
        const { name, email, password, phone, address, bloodGroup, role } = req.body;
        const identityProof = req.file ? req.file.buffer.toString("base64") : null; // Storing as Base64 (better to use Cloudinary)

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            phone,
            address,
            bloodGroup,
            identityProof,
            role, // Role should be "admin", "employee", or "user"
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});

// Login User
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        // Generate JWT Token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ token, user: { id: user._id, name: user.name, role: user.role } });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});

module.exports = router;
