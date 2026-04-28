import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../utils/api';
import './Chat.css';

const Chat = () => {
    const { user } = useContext(AuthContext);
    const [conversations, setConversations] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        if (user) {
            fetchConversations();
        }
    }, [user]);

    const fetchConversations = async () => {
        // Mock conversations
        setConversations([
            { id: 1, name: 'Vallestay Hostel', role: 'owner', lastMessage: 'Yes, food is included', time: '10:33 AM', unread: 0 },
            { id: 2, name: 'CANTRA PG', role: 'owner', lastMessage: 'Rooms are available', time: 'Yesterday', unread: 2 },
            { id: 3, name: 'Rahul Sharma', role: 'student', lastMessage: 'Thank you!', time: 'Yesterday', unread: 0 }
        ]);
    };

    const fetchMessages = (chatId) => {
        // Mock messages
        setMessages([
            { id: 1, sender: 'owner', message: 'Hello! How can I help you?', time: '10:30 AM' },
            { id: 2, sender: 'user', message: 'Is food included in the rent?', time: '10:32 AM' },
            { id: 3, sender: 'owner', message: 'Yes, breakfast and dinner are included.', time: '10:33 AM' }
        ]);
        setSelectedChat(chatId);
    };

    const sendMessage = async () => {
        if (!newMessage.trim()) return;
        
        const newMsg = {
            id: Date.now(),
            sender: 'user',
            message: newMessage,
            time: 'Just now'
        };
        setMessages([...messages, newMsg]);
        setNewMessage('');
        
        // Simulate owner reply
        setTimeout(() => {
            const reply = {
                id: Date.now() + 1,
                sender: 'owner',
                message: 'Thank you for your message. I will get back to you soon!',
                time: 'Just now'
            };
            setMessages(prev => [...prev, reply]);
        }, 2000);
    };

    if (!user) {
        return (
            <div className="chat-container">
                <div className="error-card">
                    <h2>Please Login</h2>
                    <p>You need to be logged in to use the chat feature.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="chat-page">
            <div className="chat-header">
                <h1>Messages</h1>
                <p>Chat directly with PG owners and students</p>
            </div>

            <div className="chat-main">
                {/* Conversations Sidebar */}
                <div className="conversations-sidebar">
                    <div className="search-conversations">
                        <input type="text" placeholder="Search conversations..." />
                    </div>
                    <div className="conversations-list">
                        {conversations.map(conv => (
                            <div
                                key={conv.id}
                                className={`conversation-item ${selectedChat === conv.id ? 'active' : ''}`}
                                onClick={() => fetchMessages(conv.id)}
                            >
                                <div className="conv-avatar">
                                    {conv.name.charAt(0)}
                                </div>
                                <div className="conv-info">
                                    <h4>{conv.name}</h4>
                                    <p>{conv.lastMessage}</p>
                                    <span className="conv-time">{conv.time}</span>
                                </div>
                                {conv.unread > 0 && (
                                    <span className="unread-badge">{conv.unread}</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="chat-area">
                    {selectedChat ? (
                        <>
                            <div className="chat-area-header">
                                <div className="chat-contact">
                                    <div className="contact-avatar">
                                        {conversations.find(c => c.id === selectedChat)?.name.charAt(0)}
                                    </div>
                                    <div className="contact-info">
                                        <h3>{conversations.find(c => c.id === selectedChat)?.name}</h3>
                                        <p>Online</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="messages-area">
                                {messages.map(msg => (
                                    <div key={msg.id} className={`message-bubble ${msg.sender === 'user' ? 'sent' : 'received'}`}>
                                        <div className="message-content">
                                            <p>{msg.message}</p>
                                            <span className="message-time">{msg.time}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="message-input-area">
                                <input
                                    type="text"
                                    placeholder="Type a message..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                />
                                <button onClick={sendMessage}>Send</button>
                            </div>
                        </>
                    ) : (
                        <div className="no-chat-selected">
                            <div className="empty-chat">
                                <span className="empty-icon">💬</span>
                                <h3>Select a conversation</h3>
                                <p>Choose a chat from the sidebar to start messaging</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Chat;