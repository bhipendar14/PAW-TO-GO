import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import axios from "axios";
import "./Chat.css";

const socket = io("http://localhost:5001");

const ChatWindow = ({ currentUser, role }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [unreadMessages, setUnreadMessages] = useState({});

  useEffect(() => {
    if (!currentUser || !currentUser._id) {
      console.error("❌ User not logged in or missing ID");
      return;
    }

    // Fetch users (Employees or Customers based on role)
    const fetchUsers = async () => {
      try {
        const endpoint = role === "employee" ? "/api/customers" : "/api/employees";
        const response = await axios.get(`http://localhost:5001${endpoint}`);
        setUsers(response.data);
      } catch (error) {
        console.error("⚠️ Error fetching users:", error);
      }
    };

    fetchUsers();

    socket.on("receive_message", (newMessage) => {
      if (!selectedUser || newMessage.senderId !== selectedUser._id) {
        setUnreadMessages((prev) => ({
          ...prev,
          [newMessage.senderId]: true,
        }));
      } else {
        setMessages((prev) => [...prev, newMessage]);
      }
    });

    return () => socket.off("receive_message");
  }, [selectedUser, role, currentUser]);

  const selectUser = async (user) => {
    if (!currentUser || !currentUser._id) {
      console.error("❌ Cannot select user, currentUser is missing!");
      return;
    }

    setSelectedUser(user);
    setUnreadMessages((prev) => ({ ...prev, [user._id]: false }));

    const chatRoomId = [currentUser._id, user._id].sort().join("-");
    socket.emit("join_room", chatRoomId);

    try {
      const response = await axios.get(`http://localhost:5001/api/chat/${chatRoomId}`);
      setMessages(response.data.messages);
    } catch (error) {
      console.error("⚠️ Failed to fetch messages:", error);
    }
  };

  const sendMessage = () => {
    if (!currentUser || !currentUser._id) {
      console.error("❌ User not logged in or missing ID");
      return;
    }

    if (!message.trim() || !selectedUser) return;

    const chatRoomId = [currentUser._id, selectedUser._id].sort().join("-");
    const newMessage = {
      chatId: chatRoomId,
      senderId: currentUser._id,
      receiverId: selectedUser._id,
      message,
    };

    socket.emit("send_message", newMessage);
    setMessages((prev) => [...prev, newMessage]);
    setMessage("");
  };

  return (
    <div className="chat-container">
      <div className="user-list">
        <h2>{role === "employee" ? "Customers" : "Employees"}</h2>
        {users.map((user) => (
          <div
            key={user._id}
            className={`user-item ${selectedUser?._id === user._id ? "selected" : ""}`}
            onClick={() => selectUser(user)}
          >
            {user.name}
            {unreadMessages[user._id] && <span className="unread-dot"></span>}
          </div>
        ))}
      </div>

      <div className="chat-window">
        {selectedUser ? (
          <>
            <div className="chat-header">
              <h3>Chat with {selectedUser.name}</h3>
            </div>
            <div className="chat-messages">
              {messages.map((msg, index) => (
                <div key={index} className={`message ${msg.senderId === currentUser._id ? "sent" : "received"}`}>
                  {msg.message}
                </div>
              ))}
            </div>
            <div className="chat-input">
              <input 
                type="text" 
                value={message} 
                onChange={(e) => setMessage(e.target.value)} 
                placeholder="Type a message..." 
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          </>
        ) : (
          <p>Select a user to chat with.</p>
        )}
      </div>
    </div>
  );
};

export default ChatWindow;
