require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { initializeSocket } = require("./socket");
const User = require("./models/User");

const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");
const userRoutes = require("./routes/userRoutes");
const slotRoutes = require("./routes/slotRoutes");
const customerRoutes = require("./routes/customerRoutes");

const app = express();
const server = http.createServer(app);

// Initialize socket
initializeSocket(server);

// Middleware
app.use(cors({
  origin: '*', // Allow all origins for testing
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/users", userRoutes);
app.use("/api/slots", slotRoutes);
app.use("/api/customers", customerRoutes);

// Legacy routes - keeping for backward compatibility
app.use("/api/user", userRoutes);

// Get all Customers and Employees (these aren't in userRoutes)
app.get("/api/all-customers", async (req, res) => {
  try {
    const customers = await User.find({ role: "user" });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/all-employees", async (req, res) => {
  try {
    const employees = await User.find({ role: "employee" });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Simple test endpoint
app.get("/api/test", (req, res) => {
  res.json({ message: "Server is running" });
});

// Handle 404s
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found", path: req.path });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
