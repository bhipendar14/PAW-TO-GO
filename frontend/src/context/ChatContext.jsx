import { createContext, useState, useEffect } from "react";
import io from "socket.io-client";

export const ChatContext = createContext();

const socket = io("https://paw-to-go.onrender.com");

export const ChatProvider = ({ children }) => {
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        socket.on("receive_message", (message) => {
            setMessages((prev) => [...prev, message]);
        });

        return () => {
            socket.off("receive_message");
        };
    }, []);

    const sendMessage = (senderId, receiverId, text) => {
        if (!senderId || !receiverId || !text.trim()) {
            console.error("❌ Missing required fields:", { senderId, receiverId, text });
            return;
        }
    
        const message = { senderId, receiverId, message: text };
        
        setMessages((prev) => [...prev, message]);
        socket.emit("send_message", message); 
    };
    
    // Fetch users (employees & customers)
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch("http://localhost:5001/api/users"); // Adjust endpoint
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        fetchUsers();
    }, []);

    return (
        <ChatContext.Provider value={{ messages, sendMessage, users }}>
            {children}
        </ChatContext.Provider>
    );
};
