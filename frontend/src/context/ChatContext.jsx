import { createContext, useState, useEffect } from "react";
import io from "socket.io-client";
import PropTypes from 'prop-types';

export const ChatContext = createContext();

const BACKEND_URL = "https://paw-to-go.onrender.com";
const socket = io(BACKEND_URL, {
  transports: ['websocket'],
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5
});

export const ChatProvider = ({ children }) => {
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        // Socket connection handlers
        socket.on("connect", () => {
            console.log("✅ Connected to chat server");
            setConnected(true);
            setError(null);
        });

        socket.on("disconnect", () => {
            console.log("❌ Disconnected from chat server");
            setConnected(false);
        });

        socket.on("connect_error", (error) => {
            console.error("Socket connection error:", error);
            setError("Failed to connect to chat server. Please try again.");
            setConnected(false);
        });

        // Message handlers
        socket.on("receive_message", (message) => {
            console.log("📩 Received message:", message);
            setMessages((prev) => [...prev, message]);
        });

        socket.on("message_error", (error) => {
            console.error("Message error:", error);
            setError(error.message || "Failed to send message");
        });

        return () => {
            socket.off("connect");
            socket.off("disconnect");
            socket.off("connect_error");
            socket.off("receive_message");
            socket.off("message_error");
        };
    }, []);

    const sendMessage = async (senderId, receiverId, text) => {
        if (!senderId || !receiverId || !text.trim()) {
            console.error("❌ Missing required fields:", { senderId, receiverId, text });
            return;
        }

        if (!connected) {
            setError("Not connected to chat server. Please try again.");
            return;
        }

        const messageData = {
            senderId,
            receiverId,
            message: text.trim(),
            timestamp: new Date().toISOString()
        };

        try {
            socket.emit("send_message", messageData);
            console.log("📤 Sent message:", messageData);
            setMessages((prev) => [...prev, messageData]);
            return true;
        } catch (error) {
            console.error("Error sending message:", error);
            setError("Failed to send message. Please try again.");
            return false;
        }
    };

    const joinRoom = (roomId) => {
        if (roomId) {
            socket.emit("join_room", roomId);
            console.log("🔗 Joined room:", roomId);
        }
    };

    const leaveRoom = (roomId) => {
        if (roomId) {
            socket.emit("leave_room", roomId);
            console.log("👋 Left room:", roomId);
        }
    };

    // Fetch users (employees & customers)
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(`${BACKEND_URL}/api/users`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }
                const data = await response.json();
                setUsers(data);
                setError(null);
            } catch (error) {
                console.error("Error fetching users:", error);
                setError("Failed to fetch users");
            }
        };
        fetchUsers();
    }, []);

    return (
        <ChatContext.Provider 
            value={{ 
                messages, 
                sendMessage, 
                users, 
                socket, 
                error,
                connected,
                joinRoom,
                leaveRoom
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

ChatProvider.propTypes = {
    children: PropTypes.node.isRequired
};
