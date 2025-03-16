require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const Message = require("./models/Message");
const Chat = require("./models/Chat");
const User = require("./models/User");

const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");
const userRoutes = require("./routes/userRoutes");
const slotRoutes = require("./routes/slotRoutes");

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/user", userRoutes);
app.use("/api/users", userRoutes);
app.use("/api/slots", slotRoutes);
// Fetch Messages for a User
app.get("/api/chat/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) return res.status(400).json({ error: "User ID missing" });

    const messages = await Chat.find({ participants: userId });
    if (!messages.length) return res.status(404).json({ error: "No messages found" });

    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

  


// Get all Customers (Users with role "user")
app.get("/api/customers", async (req, res) => {
  try {
    const customers = await User.find({ role: "user" });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get all Employees (Users with role "employee")
app.get("/api/employees", async (req, res) => {
  try {
    const employees = await User.find({ role: "employee" });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Socket.io Setup
const io = new Server(server, {
  cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] },
});

io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  socket.on("join_room", (chatId) => {
    socket.join(chatId);
    console.log(`👤 User joined room: ${chatId}`);
  });

  socket.on("send_message", async (data) => {
    try {
        let { chatId, senderId, receiverId, message, fileUrl } = data;

        if (!senderId || !receiverId || !message) {
            console.error("❌ Missing required fields:", { senderId, receiverId, message });
            return;
        }

        let chat = await Chat.findOne({ participants: { $all: [senderId, receiverId] } });

        if (!chat) {
            chat = new Chat({ participants: [senderId, receiverId] });
            await chat.save();
        }

        chatId = chat._id; 

        const newMessage = new Message({
            chatId,
            senderId,
            receiverId,
            message,
            fileUrl,
        });

        await newMessage.save();

        io.to(chatId.toString()).emit("receive_message", newMessage);
    } catch (error) {
        console.error("❌ Error saving message:", error);
    }
});


  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
