import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import io from 'socket.io-client';
import './ChatBox.css';

const ChatBox = ({ onClose }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [socket, setSocket] = useState(null);
    const [selectedClient, setSelectedClient] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isConnected, setIsConnected] = useState(false);
    const messagesEndRef = useRef(null);
    const chatBoxRef = useRef(null);
    
    // Generate a simple test user if none exists
    const getUser = () => {
        try {
            // Try to get from localStorage first
            const stored = localStorage.getItem('user');
            if (stored) {
                const parsed = JSON.parse(stored);
                return {
                    id: parsed._id || parsed.id || 'user-' + Date.now(),
                    name: parsed.name || 'User',
                    role: parsed.role || 'user'
                };
            }
            
            // Generate a test user if none exists
            const testUser = {
                id: 'user-' + Date.now(),
                name: 'Test User',
                role: 'user'
            };
            localStorage.setItem('user', JSON.stringify(testUser));
            return testUser;
        } catch (err) {
            console.error('Error getting user:', err);
            // Fallback user
            return {
                id: 'user-' + Date.now(),
                name: 'Guest',
                role: 'user'
            };
        }
    };
    
    const user = getUser();
    
    // Function to scroll to bottom of messages
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    
    // Handle clicks outside the chat box
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (chatBoxRef.current && !chatBoxRef.current.contains(event.target)) {
                onClose();
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);
    
    // Initialize socket connection
    useEffect(() => {
        // IMPORTANT: Use the actual URL where your server is running
        const socket = io('http://localhost:5001', {
            transports: ['websocket', 'polling']
        });
        
        socket.on('connect', () => {
            console.log('Socket connected!', socket.id);
            setIsConnected(true);
            
            // Register user with socket
            socket.emit('user_connected', {
                userId: user.id,
                role: user.role,
                name: user.name
            });
            
            // Load messages
            fetchMessages();
        });
        
        socket.on('connect_error', (err) => {
            console.error('Socket connection error:', err);
            setIsConnected(false);
        });
        
        socket.on('disconnect', () => {
            console.log('Socket disconnected');
            setIsConnected(false);
        });
        
        setSocket(socket);
        
        return () => {
            socket.disconnect();
        };
    }, []);
    
    // Load messages on connection
    const fetchMessages = async () => {
        try {
            const url = user.role === 'employee'
                ? `http://localhost:5001/api/chat/employee/${user.id}`
                : `http://localhost:5001/api/chat/customer/${user.id}`;
            
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.messages) {
                setMessages(data.messages);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setIsLoading(false);
        }
    };
    
    // Listen for new messages
    useEffect(() => {
        if (!socket) return;
        
        socket.on('receive_message', (message) => {
            console.log('Received message:', message);
            
            if (message.clientInfo && user.role === 'employee') {
                setSelectedClient(message.clientInfo);
            }
            
            setMessages(prev => [...prev, message]);
        });
        
        return () => {
            socket.off('receive_message');
        };
    }, [socket, user.role]);
    
    // Auto-scroll when messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    
    // Send a message
    const sendMessage = async (e) => {
        e.preventDefault();
        
        if (!newMessage.trim() || !socket || !isConnected) return;
        
        const messageData = {
            senderId: user.id,
            senderName: user.name,
            senderRole: user.role,
            receiverId: user.role === 'employee' ? (selectedClient?.id || 'all_customers') : 'employee',
            message: newMessage,
            timestamp: new Date()
        };
        
        // Optimistically add to UI
        setMessages(prev => [...prev, messageData]);
        setNewMessage('');
        
        try {
            // Send via socket
            socket.emit('send_message', messageData);
            
            // Also send via REST API for redundancy
            await fetch('http://localhost:5001/api/chat/message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(messageData)
            });
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };
    
    return (
        <div className="chat-box" ref={chatBoxRef}>
            <div className="chat-header">
                <div>
                    <h3>{user.role === 'employee' ? 'Customer Messages' : 'Customer Support'}</h3>
                    {selectedClient && user.role === 'employee' && (
                        <small>Replying to: {selectedClient.name}</small>
                    )}
                </div>
                <span className={`online-status ${isConnected ? 'connected' : 'disconnected'}`}>
                    {isConnected ? 'Online' : 'Connecting...'}
                </span>
            </div>
            
            <div className="messages-container">
                {isLoading ? (
                    <div className="loading">Loading messages...</div>
                ) : messages.length === 0 ? (
                    <div className="no-messages">
                        <p>No messages yet</p>
                        <p>Send a message to start the conversation</p>
                    </div>
                ) : (
                    <>
                        {messages.map((msg, index) => (
                            <div 
                                key={index} 
                                className={`message ${msg.senderId === user.id ? 'sent' : 'received'}`}
                                onClick={() => {
                                    if (user.role === 'employee' && msg.senderId !== user.id) {
                                        setSelectedClient({ id: msg.senderId, name: msg.senderName });
                                    }
                                }}
                            >
                                <div className="message-content">
                                    <strong>{msg.senderName}</strong>
                                    <p>{msg.message}</p>
                                    <span className="timestamp">
                                        {new Date(msg.timestamp).toLocaleTimeString([], { 
                                            hour: '2-digit', 
                                            minute: '2-digit' 
                                        })}
                                    </span>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            <form onSubmit={sendMessage} className="message-input">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={user.role === 'employee' && selectedClient 
                        ? `Reply to ${selectedClient.name}...` 
                        : "Type your message..."}
                    disabled={!isConnected}
                />
                <button type="submit" disabled={!isConnected || !newMessage.trim()}>
                    <svg viewBox="0 0 24 24" width="24" height="24">
                        <path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                    </svg>
                </button>
            </form>
        </div>
    );
};

ChatBox.propTypes = {
    onClose: PropTypes.func.isRequired
};

export default ChatBox; 