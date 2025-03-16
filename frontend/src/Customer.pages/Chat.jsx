import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import "../employee/Chat.css"; // Import CSS for styling
import Navbar from "../components/NavbarUser";

const socket = io("https://paw-to-go.onrender.com"); // Replace with your backend URL

const CustomerChat = ({ userId }) => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [unreadMessages, setUnreadMessages] = useState({});
  const chatMessagesRef = useRef(null);

  useEffect(() => {
    // Fetch employees from backend
    axios.get("https://paw-to-go.onrender.com/api/employees").then((response) => {
      setEmployees(response.data);
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

  

  const selectEmployee = async (employee) => {
    setSelectedEmployee(employee);
    setUnreadMessages((prev) => ({ ...prev, [employee._id]: false }));

    const chatRoomId = [userId, employee._id].sort().join("-");
    socket.emit("join_room", chatRoomId);

    try {
      const response = await axios.get(`https://paw-to-go.onrender.com/api/chat/${chatRoomId}`);
      setMessages(response.data.messages);
    } catch (error) {
      console.error("Failed to fetch messages", error);
    }
  };

  const sendMessage = () => {
    if (message.trim() && selectedEmployee) {
      const chatRoomId = [userId, selectedEmployee._id].sort().join("-");
      const newMessage = {
        chatId: chatRoomId,
        senderId: userId,
        receiverId: selectedEmployee._id,
        message,
        
      };

      console.log("Customer Sending Message:", newMessage); // Debugging
      socket.emit("send_message", newMessage);
      setMessages((prev) => [...prev, newMessage]);
      setMessage("");
    }
  };

  return (
    <>
      <Navbar />
      <div className="chat-container">
        {/* Left Sidebar (Employee List) */}
        <div className="user-list">
          <h2>Employees</h2>
          {employees.length === 0 ? (
            <p>No employees available. We are connecting with our employees...<br/><br/><div className="loader" style={{ color: "green" , fontSize:"20px", fontWeight:"bold"}}>please wait a mintue....</div></p>
          
          ) : (
            employees.map((employee) => (
              <div
                key={employee._id}
                className={`user-item ${selectedEmployee?._id === employee._id ? "selected" : ""}`}
                onClick={() => selectEmployee(employee)}
              >
                {employee.name}
                {unreadMessages[employee._id] && <span className="unread-dot"></span>}
              </div>
            ))
          )}
        </div>

        {/* Chat Window */}
        <div className="chat-window">
          {selectedEmployee ? (
            <>
              <div className="chat-header">
                <h3>Chat with {selectedEmployee.name}</h3>
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
            <p>Select an employee to chat with.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default CustomerChat;