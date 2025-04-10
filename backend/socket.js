const socketIo = require("socket.io");
const Message = require("./models/Message");

let io;

const initializeSocket = (server) => {
    io = socketIo(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    const userSockets = new Map(); // Store user socket mappings

    io.on("connection", (socket) => {
        console.log("🟢 User connected:", socket.id);

        // Handle user connecting
        socket.on("user_connected", ({ userId, role, name }) => {
            console.log(`User connected with data:`, { userId, role, name });
            
            if (!userId) {
                console.warn("Missing userId in user_connected event");
                return;
            }
            
            // Store user info with socket id
            userSockets.set(userId, {
                socketId: socket.id,
                role,
                name
            });
            
            // Join appropriate room
            if (role === 'employee') {
                socket.join('employee_room');
                console.log(`👥 Employee ${name} (${userId}) joined employee_room`);
            } else {
                socket.join(`user_${userId}`);
                console.log(`👤 Customer ${name} (${userId}) joined personal room`);
            }
        });

        // Handle sending messages
        socket.on("send_message", async (data) => {
            try {
                console.log("Message received:", data);
                const { senderId, senderName, receiverId, message, senderRole } = data;

                if (!senderId || !message) {
                    console.error("Missing required message fields");
                    return;
                }

                // Store message in database
                const newMessage = new Message({
                    senderId,
                    senderName: senderName || "Unknown",
                    receiverId: receiverId || "all",
                    message,
                    senderRole: senderRole || "user",
                    timestamp: new Date()
                });
                
                await newMessage.save();
                console.log("Message saved to database");

                // Broadcast to appropriate rooms
                if (senderRole === 'user') {
                    // Customer message goes to all employees
                    socket.to('employee_room').emit('receive_message', {
                        ...data,
                        _id: newMessage._id,
                        clientInfo: {
                            id: senderId,
                            name: senderName
                        }
                    });
                    console.log(`Message from customer ${senderName} sent to all employees`);
                } else {
                    // Employee message goes to specific customer
                    if (receiverId && receiverId !== 'all_customers') {
                        socket.to(`user_${receiverId}`).emit('receive_message', {
                            ...data,
                            _id: newMessage._id
                        });
                        console.log(`Message from employee ${senderName} sent to customer ${receiverId}`);
                    } else {
                        // Broadcast to all customer rooms if no specific customer
                        for (const [userId, userData] of userSockets.entries()) {
                            if (userData.role === 'user') {
                                socket.to(`user_${userId}`).emit('receive_message', {
                                    ...data,
                                    _id: newMessage._id
                                });
                            }
                        }
                        console.log(`Message from employee ${senderName} broadcast to all customers`);
                    }
                }
            } catch (error) {
                console.error("❌ Error processing message:", error);
            }
        });

        // Handle disconnection
        socket.on("disconnect", () => {
            // Remove user from mapping
            for (const [userId, userData] of userSockets.entries()) {
                if (userData.socketId === socket.id) {
                    userSockets.delete(userId);
                    console.log(`🔴 User disconnected: ${userData.name} (${userId})`);
                    break;
                }
            }
        });
    });
};

module.exports = { initializeSocket };
