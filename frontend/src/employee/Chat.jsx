import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import "./chat.css"; // Import CSS for styling
import Navbar from "./EmployeeNavbar";

const socket = io("https://paw-to-go.onrender.com"); // Replace with your backend URL

const EmployeeChat = ({ userId }) => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [unreadMessages, setUnreadMessages] = useState({});
  const chatMessagesRef = useRef(null);

  useEffect(() => {
    // Fetch customers from backend
    axios.get("https://paw-to-go.onrender.com/api/customers").then((response) => {
      setCustomers(response.data);
    });

    // Listen for incoming messages
    socket.on("receive_message", (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
      if (newMessage.senderId !== userId) {
        setUnreadMessages((prev) => ({
          ...prev,
          [newMessage.senderId]: true,
        }));
      }
    });

    return () => {
      socket.off("receive_message");
    };
  }, [userId]);

  useEffect(() => {
    // Auto-scroll to the bottom of the chat window
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages]);

  const selectCustomer = async (customer) => {
    setSelectedCustomer(customer);
    setUnreadMessages((prev) => ({ ...prev, [customer._id]: false }));

    const chatRoomId = [userId, customer._id].sort().join("-");
    socket.emit("join_room", chatRoomId);

    try {
      const response = await axios.get(`https://paw-to-go.onrender.com/api/chat/${chatRoomId}`);
      setMessages(response.data.messages);
    } catch (error) {
      console.error("Failed to fetch messages", error);
    }
  };

  const sendMessage = () => {
    if (message.trim() && selectedCustomer) {
      const chatRoomId = [userId, selectedCustomer._id].sort().join("-");
      const newMessage = {
        chatId: chatRoomId,
        senderId: userId,
        receiverId: selectedCustomer._id,
        message,
      };

      console.log("Employee Sending Message:", newMessage); // Debugging
      socket.emit("send_message", newMessage);
      setMessages((prev) => [...prev, newMessage]);
      setMessage("");
    }
  };

  return (
    <>
      <Navbar />
      <div className="chat-container">
        {/* Left Sidebar (Customer List) */}
        <div className="user-list">
          <h2>Customers</h2>
          {customers.length === 0 ? (
            <p>No customers available.<br/> <br/> <div className="loader" style={{ color: "green" , fontSize: "20px" ,fontbold: "bold" }}>The server is connecting...</div></p>
          ) : (
            customers.map((customer) => (
              <div
                key={customer._id}
                className={`user-item ${selectedCustomer?._id === customer._id ? "selected" : ""}`}
                onClick={() => selectCustomer(customer)}
              >
                {customer.name}
                {unreadMessages[customer._id] && <span className="unread-dot"></span>}
              </div>
            ))
          )}
        </div>

        {/* Chat Window */}
        <div className="chat-window">
          {selectedCustomer ? (
            <>
              <div className="chat-header">
                <h3>Chat with {selectedCustomer.name}</h3>
              </div>
              <div className="chat-messages" ref={chatMessagesRef}>
                {messages.map((msg, index) => (
                  <div key={index} className={`message ${msg.senderId === userId ? "sent" : "received"}`}>
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
            <p>Select a customer to chat with.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default EmployeeChat;