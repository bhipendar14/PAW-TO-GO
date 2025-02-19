const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const User = require("../models/User");
require("dotenv").config();

const router = express.Router();

// 🔹 Multer Setup for File Uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// 🔹 REGISTER USER
router.post("/register", upload.single("identityProof"), async (req, res) => {
    try {
        const { name, email, password, phone, address, bloodGroup, role } = req.body;
        const identityProof = req.file ? req.file.buffer.toString("base64") : null;

        console.log("🔹 Registering User:", email);

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password securely
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            phone,
            address,
            bloodGroup,
            identityProof,
            role
        });

        await newUser.save();
        console.log("✅ User Registered Successfully:", email);
        res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        console.error("❌ Registration Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

// 🔹 LOGIN USER
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("🔹 Login Attempt for:", email);

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        // Compare hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        // Generate JWT Token
        if (!process.env.TOKEN_KEY) {
            console.error("❌ TOKEN_KEY is missing in environment variables!");
            return res.status(500).json({ message: "Server misconfiguration" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.TOKEN_KEY,
            { expiresIn: "1h" }
        );

        res.json({ token, user: { id: user._id, name: user.name, role: user.role } });

    } catch (error) {
        console.error("❌ Login Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});


module.exports = router;
