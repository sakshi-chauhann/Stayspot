import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../utils/api';

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (user) {
            fetchNotifications();
            const interval = setInterval(fetchNotifications, 30000);
            return () => clearInterval(interval);
        }
    }, [user]);

    const fetchNotifications = async () => {
        try {
            const response = await API.get('/notifications');
            setNotifications(response.data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const markAsRead = async (id) => {
        try {
            await API.put(`/notifications/${id}/read`);
            fetchNotifications();
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    if (!user) return null;

    return (
        <div style={{ position: 'relative' }}>
            <button 
                onClick={() => setShowDropdown(!showDropdown)}
                style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.3rem',
                    cursor: 'pointer',
                    padding: '0.5rem',
                    position: 'relative',
                    borderRadius: '50%'
                }}
            >
                🔔
                {unreadCount > 0 && (
                    <span style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        background: '#f56565',
                        color: 'white',
                        fontSize: '0.7rem',
                        padding: '2px 5px',
                        borderRadius: '10px',
                        minWidth: '18px'
                    }}>
                        {unreadCount}
                    </span>
                )}
            </button>
            
            {showDropdown && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    width: '320px',
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                    zIndex: 1000,
                    marginTop: '10px',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 16px',
                        borderBottom: '1px solid #e2e8f0',
                        background: '#f7fafc'
                    }}>
                        <h4 style={{ margin: 0, color: '#2d3748' }}>Notifications</h4>
                        <button 
                            onClick={() => setShowDropdown(false)}
                            style={{ background: 'none', border: 'none', fontSize: '1rem', cursor: 'pointer' }}
                        >
                            ✕
                        </button>
                    </div>
                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        {notifications.length === 0 ? (
                            <div style={{ padding: '40px', textAlign: 'center', color: '#718096' }}>
                                No new notifications
                            </div>
                        ) : (
                            notifications.map(notification => (
                                <div 
                                    key={notification._id} 
                                    onClick={() => markAsRead(notification._id)}
                                    style={{
                                        display: 'flex',
                                        gap: '12px',
                                        padding: '12px 16px',
                                        cursor: 'pointer',
                                        borderBottom: '1px solid #f0f0f0',
                                        background: !notification.read ? '#ebf4ff' : 'white'
                                    }}
                                >
                                    <div style={{ fontSize: '1.2rem' }}>{notification.icon || '🔔'}</div>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ margin: '0 0 4px 0', fontSize: '0.9rem', color: '#2d3748' }}>
                                            {notification.message}
                                        </p>
                                        <small style={{ fontSize: '0.7rem', color: '#718096' }}>
                                            {new Date(notification.createdAt).toLocaleDateString()}
                                        </small>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;