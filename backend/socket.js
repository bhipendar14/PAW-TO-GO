const { Server } = require("socket.io");
const Chat = require("./models/Chat");
const Message = require("./models/Message");

const setupSocket = (server) => {
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

        // Ensure chat exists
        if (!chatId) {
          let chat = await Chat.findOne({ participants: { $all: [senderId, receiverId] } });

          if (!chat) {
            chat = new Chat({ participants: [senderId, receiverId] });
            await chat.save();
          }

          chatId = chat._id;
        }

        // Save message
        const newMessage = new Message({
          chatId,
          senderId,
          receiverId,
          message,
          fileUrl,
        });

        await newMessage.save();

        // Emit message to the chat room
        io.to(chatId.toString()).emit("receive_message", newMessage);
      } catch (error) {
        console.error("❌ Error saving message:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("🔴 User disconnected:", socket.id);
    });
  });

  return io;
};

module.exports = setupSocket;
