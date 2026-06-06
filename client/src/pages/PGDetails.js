import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './PGDetails.css';

// Import PG photos from organized folders
import vallestay1 from '../assets/Vallestay Girls Hostel/v-1.jpeg';
import vallestay2 from '../assets/Vallestay Girls Hostel/v-2.jpeg';
import vallestay3 from '../assets/Vallestay Girls Hostel/v-3.jpeg';

import cantra1 from '../assets/CANTRA PG/c-1.jpeg';
import cantra2 from '../assets/CANTRA PG/c-2.jpeg';
import cantra3 from '../assets/CANTRA PG/c-3.jpeg';

import solitaire1 from '../assets/Solitaire PG for Girls/s-1.jpeg';
import solitaire2 from '../assets/Solitaire PG for Girls/s-2.jpeg';
import solitaire3 from '../assets/Solitaire PG for Girls/s-3.jpeg';

import balaji1 from '../assets/Shri Balaji Boys Hostel/sb-1.jpeg';
import balaji2 from '../assets/Shri Balaji Boys Hostel/sb-2.jpeg';
import balaji3 from '../assets/Shri Balaji Boys Hostel/sb-3.jpeg';

import newfriends1 from '../assets/New Friends PG (Boys)/n-1.jpeg';
import newfriends2 from '../assets/New Friends PG (Boys)/n-2.jpeg';
import newfriends3 from '../assets/New Friends PG (Boys)/n-3.jpeg';

import galaxy1 from '../assets/Galaxy Grand PG/g-1.jpeg';
import galaxy2 from '../assets/Galaxy Grand PG/g-2.jpeg';
import galaxy3 from '../assets/Galaxy Grand PG/g-3.jpeg';

// PG photos mapping
const pgPhotos = {
    'Vallestay Girls Hostel': [vallestay1, vallestay2, vallestay3],
    'CANTRA PG': [cantra1, cantra2, cantra3],
    'Solitaire PG for Girls': [solitaire1, solitaire2, solitaire3],
    'Shri Balaji Boys Hostel': [balaji1, balaji2, balaji3],
    'New Friends PG (Boys)': [newfriends1, newfriends2, newfriends3],
    'Galaxy Grand PG': [galaxy1, galaxy2, galaxy3]
};

const PGDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [pg, setPg] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
    const [selectedRoom, setSelectedRoom] = useState('');
    const [selectedRoomPrice, setSelectedRoomPrice] = useState(null);
    const [showChat, setShowChat] = useState(false);
    const [message, setMessage] = useState('');
    const [chatMessages, setChatMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    // All PGs data with CORRECT coordinates (from you)
    const allPGs = [
        {
            id: 1,
            name: 'Vallestay Girls Hostel',
            address: 'Shiv Vihar, Saharanpur Road, Majra, Dehradun',
            fullAddress: 'Shiv Vihar, Saharanpur Road, Majra, Dehradun, Uttarakhand 248171',
            price: 8000,
            type: 'girls',
            description: 'Safe and secure girls hostel with modern amenities. Located near Graphic Era Hill University. Perfect for students looking for a comfortable and secure living environment.',
            facilities: ['Kitchen', 'Laundry Service', 'Private Bathroom', 'WiFi', 'Balcony', 'Fire Safety', 'CCTV Surveillance'],
            contactNumber: '+91 9876543210',
            ownerName: 'Mrs. Sharma',
            location: { lat: 30.29630931013221, lng: 78.00513459557361 },
            roomTypes: [
                { type: 'Single Room', price: 12000, available: 2 },
                { type: 'Double Sharing', price: 8000, available: 5 },
                { type: 'Triple Sharing', price: 6000, available: 3 }
            ],
            images: ['🏠', '🛏️', '🚿', '🍳'],
            rating: 4.5,
            totalReviews: 18,
            distance: '0.8 km'
        },
        {
            id: 2,
            name: 'CANTRA PG',
            address: 'Near Ballupur Chowk, Rajender Nagar, Dehradun',
            fullAddress: 'House No. 359/1, Street No. 11, Near Ballupur Chowk, Rajender Nagar, Dehradun',
            price: 10000,
            type: 'boys',
            description: 'Comfortable PG with all modern facilities. Perfect for students and working professionals.',
            facilities: ['Kitchen', 'Laundry Service', 'Private Bathroom', 'WiFi', 'Parking', 'CCTV'],
            contactNumber: '+91 9876543211',
            ownerName: 'Mr. Verma',
            location: { lat: 30.3387467492223, lng: 78.01585455139707 },
            roomTypes: [
                { type: 'Single Room', price: 12000, available: 1 },
                { type: 'Double Sharing', price: 10000, available: 4 },
                { type: 'Triple Sharing', price: 8000, available: 2 }
            ],
            images: ['🏠', '🛏️', '🚗'],
            rating: 4.3,
            totalReviews: 12,
            distance: '1.2 km'
        },
        {
            id: 3,
            name: 'Solitaire PG for Girls',
            address: 'Bell Road, Subhash Nagar, Dehradun',
            fullAddress: '154/2-1, Bell Road, Society Area, Subhash Nagar, Dehradun',
            price: 12000,
            type: 'girls',
            description: 'Premium girls hostel with excellent facilities and security. Close to college and market.',
            facilities: ['Mess Available', 'Water Purifier', 'Transport Facility', 'WiFi', 'Housing Staff'],
            contactNumber: '+91 9876543212',
            ownerName: 'Mrs. Gupta',
            location: { lat: 30.27026, lng: 77.99304 },
            roomTypes: [
                { type: 'Single Room', price: 15000, available: 3 },
                { type: 'Double Sharing', price: 12000, available: 6 },
                { type: 'Triple Sharing', price: 10000, available: 4 }
            ],
            images: ['🏠', '🍽️', '🚌'],
            rating: 4.7,
            totalReviews: 24,
            distance: '1.5 km'
        },
        {
            id: 4,
            name: 'Shri Balaji Boys Hostel',
            address: 'Bharuwala Colony, Clement Town, Dehradun',
            fullAddress: 'Lane No. 11, Bharuwala Colony, Clement Town, Dehradun',
            price: 7000,
            type: 'boys',
            description: 'Affordable and clean boys hostel with essential amenities. Friendly environment.',
            facilities: ['Free WiFi', 'RO Water', 'Daily Cleaning', 'Parking', 'Fire Extinguisher', 'Power Backup'],
            contactNumber: '+91 9876543213',
            ownerName: 'Mr. Singh',
            location: { lat: 30.272042202745304, lng: 78.00518469810191 },
            roomTypes: [
                { type: 'Single Room', price: 9000, available: 4 },
                { type: 'Double Sharing', price: 7000, available: 8 },
                { type: 'Triple Sharing', price: 5500, available: 6 }
            ],
            images: ['🏠', '💧', '⚡'],
            rating: 4.2,
            totalReviews: 9,
            distance: '2.0 km'
        },
        {
            id: 5,
            name: 'New Friends PG (Boys)',
            address: 'Sunshine Enclave Road, Clement Town, Dehradun',
            fullAddress: 'Sunshine Enclave Road, Clement Town, Dehradun',
            price: 8500,
            type: 'boys',
            description: 'Friendly environment with all modern facilities. Great for students.',
            facilities: ['WiFi', '24/7 Power Backup', 'Water Purifier', 'Mess Available'],
            contactNumber: '+91 9876543214',
            ownerName: 'Mr. Kumar',
            location: { lat: 30.271293895923932, lng: 77.99356271091519 },
            roomTypes: [
                { type: 'Single Room', price: 10000, available: 2 },
                { type: 'Double Sharing', price: 8500, available: 5 },
                { type: 'Triple Sharing', price: 7000, available: 3 }
            ],
            images: ['🏠', '⚡', '🍽️'],
            rating: 4.4,
            totalReviews: 15,
            distance: '1.8 km'
        },
        {
            id: 6,
            name: 'Galaxy Grand PG',
            address: 'Graphic Era Hill University Road, Subhash Nagar, Dehradun',
            fullAddress: 'Graphic Era Hill University Road, Subhash Nagar, Dehradun',
            price: 9500,
            type: 'co-ed',
            description: 'Premium PG with excellent location near Graphic Era Hill University.',
            facilities: ['WiFi', 'Tiffin System (No Mess)', 'Laundry Service'],
            contactNumber: '+91 9876543215',
            ownerName: 'Mrs. Mehta',
            location: { lat: 30.271640102104072, lng: 77.9971988820796 },
            roomTypes: [
                { type: 'Single Room', price: 11000, available: 3 },
                { type: 'Double Sharing', price: 9500, available: 6 },
                { type: 'Triple Sharing', price: 8000, available: 4 }
            ],
            images: ['🏠', '📶', '👕'],
            rating: 4.6,
            totalReviews: 21,
            distance: '0.5 km'
        }
    ];

    // FIXED useEffect - This was the problem!
    useEffect(() => {
        const foundPG = allPGs.find(p => p.id === parseInt(id));
        if (foundPG) {
            setPg(foundPG);
        }
        
        // Load reviews from localStorage
        const savedReviews = localStorage.getItem(`reviews_pg_${id}`);
        if (savedReviews) {
            setReviews(JSON.parse(savedReviews));
        } else {
            // Default reviews for each PG
            const defaultReviews = {
                1: [
                    { id: 1, userName: 'Riya S.', rating: 5, comment: 'Great place! Very clean and safe. Owner is very helpful.', date: '2024-02-15' },
                    { id: 2, userName: 'Priya M.', rating: 4, comment: 'Good location near college. Food is decent.', date: '2024-02-10' }
                ],
                2: [
                    { id: 1, userName: 'Amit K.', rating: 5, comment: 'Excellent facilities and friendly owner.', date: '2024-02-20' },
                    { id: 2, userName: 'Rahul S.', rating: 4, comment: 'Good value for money. Recommended!', date: '2024-02-15' }
                ],
                3: [
                    { id: 1, userName: 'Neha G.', rating: 5, comment: 'Best girls PG in Dehradun! Very safe and clean.', date: '2024-02-18' },
                    { id: 2, userName: 'Simran K.', rating: 5, comment: 'Amazing food and friendly staff.', date: '2024-02-12' }
                ]
            };
            setReviews(defaultReviews[id] || [
                { id: 1, userName: 'Reviewer', rating: 4, comment: 'Nice place!', date: '2024-02-01' }
            ]);
        }
        
        // Load chat messages
        const savedChat = localStorage.getItem(`chat_pg_${id}_${user?.id}`);
        if (savedChat) {
            setChatMessages(JSON.parse(savedChat));
        } else {
            setChatMessages([
                { id: 1, sender: 'owner', message: 'Hello! How can I help you?', time: '10:30 AM' },
                { id: 2, sender: 'user', message: 'Is food included in the rent?', time: '10:32 AM' },
                { id: 3, sender: 'owner', message: 'Yes, breakfast and dinner are included.', time: '10:33 AM' }
            ]);
        }
        
        setLoading(false);
    }, [id, user?.id, allPGs]);  // ← Fixed: Added all dependencies

    const handleAddReview = (e) => {
        e.preventDefault();
        if (!user) {
            alert('Please login to add a review');
            navigate('/login');
            return;
        }
        
        const newReviewObj = {
            id: Date.now(),
            userName: user.name,
            rating: newReview.rating,
            comment: newReview.comment,
            date: new Date().toISOString().split('T')[0]
        };
        
        const updatedReviews = [newReviewObj, ...reviews];
        setReviews(updatedReviews);
        localStorage.setItem(`reviews_pg_${id}`, JSON.stringify(updatedReviews));
        setNewReview({ rating: 5, comment: '' });
        alert('Review added successfully!');
    };

    const handleBooking = () => {
        if (!user) {
            alert('Please login to book a room');
            navigate('/login');
            return;
        }
        if (!selectedRoom) {
            alert('Please select a room type');
            return;
        }
        
        // Find the full room object
        const roomObj = pg.roomTypes.find(r => r.type === selectedRoom);
        
        // Navigate to booking page with selected room details
        navigate('/booking-form', { 
            state: { 
                selectedRoom: selectedRoom,
                selectedRoomPrice: selectedRoomPrice,
                roomObj: roomObj,
                pg: pg 
            } 
        });
    };

    const sendMessage = () => {
        if (!message.trim()) return;
        
        const newMessage = {
            id: Date.now(),
            sender: 'user',
            message: message,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        const updatedMessages = [...chatMessages, newMessage];
        setChatMessages(updatedMessages);
        localStorage.setItem(`chat_pg_${id}_${user?.id}`, JSON.stringify(updatedMessages));
        setMessage('');
        
        // Simulate owner reply after 2 seconds
        setTimeout(() => {
            const replyMessage = {
                id: Date.now() + 1,
                sender: 'owner',
                message: 'Thank you for your message. I will get back to you soon!',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            const newMessages = [...updatedMessages, replyMessage];
            setChatMessages(newMessages);
            localStorage.setItem(`chat_pg_${id}_${user?.id}`, JSON.stringify(newMessages));
        }, 2000);
    };

    const getTypeColor = (type) => {
        if (type === 'boys') return '#3498db';
        if (type === 'girls') return '#e91e63';
        return '#9b59b6';
    };

    const getTypeLabel = (type) => {
        if (type === 'boys') return 'Boys PG';
        if (type === 'girls') return 'Girls PG';
        return 'Co-ed PG';
    };

    if (loading) {
        return <div className="loading">Loading PG details...</div>;
    }

    if (!pg) {
        return (
            <div className="error-container">
                <h2>PG Not Found</h2>
                <p>The PG you're looking for doesn't exist.</p>
                <button onClick={() => navigate('/explore')}>Back to Explore</button>
            </div>
        );
    }

    return (
        <div className="pg-details-page">
            {/* Image Gallery */}
            <div className="image-gallery">
                {pgPhotos[pg.name] && pgPhotos[pg.name].length > 0 ? (
                    pgPhotos[pg.name].slice(0, 3).map((img, idx) => (
                        <div key={idx} className="gallery-item">
                            <img 
                                src={img} 
                                alt={`${pg.name} interior ${idx + 1}`} 
                                className="gallery-image" 
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.parentElement.innerHTML = '<div class="image-placeholder">🏠</div>';
                                }}
                            />
                        </div>
                    ))
                ) : (
                    <div className="gallery-item">
                        <div className="image-placeholder" style={{ fontSize: '4rem' }}>🏠</div>
                    </div>
                )}
            </div>

            <div className="details-container">
                <div className="main-content">
                    {/* Basic Information */}
                    <div className="info-section">
                        <h1>{pg.name}</h1>
                        <p className="address">📍 {pg.fullAddress || pg.address}</p>
                        <div className="badges">
                            <span className="type-badge" style={{ background: getTypeColor(pg.type) }}>
                                {getTypeLabel(pg.type)}
                            </span>
                            <span className="rating-badge">⭐ {pg.rating} ({pg.totalReviews} reviews)</span>
                            <span className="distance-badge">📍 {pg.distance} from Graphic Era</span>
                        </div>
                        <p className="description">{pg.description}</p>
                    </div>

                    {/* Room Types & Availability */}
                    <div className="rooms-section">
                        <h3>Room Types & Availability</h3>
                        <div className="rooms-grid">
                            {pg.roomTypes.map((room, idx) => (
                                <div key={idx} className="room-card">
                                    <h4>{room.type}</h4>
                                    <p className="room-price">₹{room.price}<span>/month</span></p>
                                    <p className="availability">
                                        {room.available > 0 ? (
                                            <span className="available">✅ {room.available} beds available</span>
                                        ) : (
                                            <span className="unavailable">❌ Full</span>
                                        )}
                                    </p>
                                    <button 
                                        className="select-room-btn"
                                        onClick={() => {
                                            setSelectedRoom(room.type);
                                            setSelectedRoomPrice(room.price);
                                        }}
                                        disabled={room.available === 0}
                                    >
                                        Select
                                    </button>
                                </div>
                            ))}
                        </div>
                        {selectedRoom && (
                            <div className="selected-room-info">
                                Selected: <strong>{selectedRoom}</strong> at ₹{selectedRoomPrice}/month
                            </div>
                        )}
                    </div>

                    {/* Facilities */}
                    <div className="facilities-section">
                        <h3>Facilities & Amenities</h3>
                        <div className="facilities-grid">
                            {pg.facilities.map((facility, idx) => (
                                <div key={idx} className="facility-item">
                                    <span className="facility-icon">✓</span>
                                    <span>{facility}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Google Maps Section */}
                    <div className="map-section">
                        <h3>Location Map</h3>
                        <div className="map-container">
                            <div className="map-placeholder">
                                <iframe
                                    title="PG Location"
                                    width="100%"
                                    height="100%"
                                    frameBorder="0"
                                    style={{ border: 0 }}
                                    src={`https://maps.google.com/maps?q=${pg.location.lat},${pg.location.lng}&z=16&output=embed`}
                                    allowFullScreen
                                />
                            </div>
                            <button className="directions-btn" onClick={() => window.open(`https://maps.google.com?daddr=${pg.location.lat},${pg.location.lng}`)}>
                                🗺️ Get Directions from Graphic Era
                            </button>
                        </div>
                    </div>

                    {/* Owner Info & Contact */}
                    <div className="owner-section">
                        <h3>Owner Information</h3>
                        <div className="owner-card">
                            <div className="owner-avatar">👤</div>
                            <div className="owner-info">
                                <h4>{pg.ownerName}</h4>
                                <p>📞 {pg.contactNumber}</p>
                            </div>
                            <div className="owner-actions">
                                <button className="chat-btn" onClick={() => setShowChat(!showChat)}>
                                    💬 Chat with Owner
                                </button>
                                <button className="call-btn" onClick={() => window.location.href = `tel:${pg.contactNumber}`}>
                                    📞 Call Now
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Chat Window */}
                    {showChat && user && (
                        <div className="chat-window">
                            <div className="chat-header">
                                <h4>Chat with {pg.ownerName}</h4>
                                <button onClick={() => setShowChat(false)}>✕</button>
                            </div>
                            <div className="chat-messages">
                                {chatMessages.map(msg => (
                                    <div key={msg.id} className={`message ${msg.sender === 'user' ? 'user-message' : 'owner-message'}`}>
                                        <p>{msg.message}</p>
                                        <small>{msg.time}</small>
                                    </div>
                                ))}
                            </div>
                            <div className="chat-input">
                                <input
                                    type="text"
                                    placeholder="Type your message..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                />
                                <button onClick={sendMessage}>Send</button>
                            </div>
                        </div>
                    )}

                    {!user && showChat && (
                        <div className="chat-warning">
                            <p>Please <Link to="/login">login</Link> to chat with the owner.</p>
                        </div>
                    )}

                    {/* Reviews Section */}
                    <div className="reviews-section">
                        <h3>Ratings & Reviews</h3>
                        <div className="reviews-summary">
                            <div className="average-rating">
                                <span className="big-rating">{pg.rating}</span>
                                <span>/5</span>
                                <p>Based on {reviews.length} reviews</p>
                            </div>
                        </div>
                        
                        {user && user.role === 'student' && (
                            <form onSubmit={handleAddReview} className="review-form">
                                <div className="review-rating-select">
                                    <label>Your Rating:</label>
                                    <select
                                        value={newReview.rating}
                                        onChange={(e) => setNewReview({...newReview, rating: parseInt(e.target.value)})}
                                    >
                                        {[5,4,3,2,1].map(num => (
                                            <option key={num} value={num}>{num} ⭐ {num === 5 ? '(Excellent)' : num === 4 ? '(Very Good)' : num === 3 ? '(Good)' : num === 2 ? '(Fair)' : '(Poor)'}</option>
                                        ))}
                                    </select>
                                </div>
                                <textarea
                                    placeholder="Write your review..."
                                    value={newReview.comment}
                                    onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                                    required
                                    rows="3"
                                />
                                <button type="submit" className="submit-review-btn">Submit Review</button>
                            </form>
                        )}
                        
                        {!user && (
                            <div className="login-to-review">
                                <p><Link to="/login">Login</Link> to write a review</p>
                            </div>
                        )}
                        
                        <div className="reviews-list">
                            {reviews.length === 0 ? (
                                <p className="no-reviews">No reviews yet. Be the first to review!</p>
                            ) : (
                                reviews.map(review => (
                                    <div key={review.id} className="review-item">
                                        <div className="review-header">
                                            <strong>{review.userName}</strong>
                                            <span className="review-rating">{"⭐".repeat(review.rating)}</span>
                                        </div>
                                        <p className="review-comment">{review.comment}</p>
                                        <small className="review-date">{new Date(review.date).toLocaleDateString()}</small>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Booking Sidebar */}
                <div className="booking-sidebar">
                    <div className="price-card">
                        <h3>{selectedRoomPrice ? 'Selected Room Price' : 'Starting from'}</h3>
                        <div className="price">
                            ₹{selectedRoomPrice || pg.price}
                            <span>/month</span>
                        </div>
                        
                        {selectedRoom && (
                            <div className="selected-room-display" style={{ marginTop: '0.5rem', padding: '0.5rem', background: '#f0f0f0', borderRadius: '8px' }}>
                                <strong>Selected: {selectedRoom}</strong>
                                {selectedRoomPrice && selectedRoomPrice !== pg.price && (
                                    <div style={{ fontSize: '0.8rem', color: '#534AB7', marginTop: '0.3rem' }}>
                                        ₹{selectedRoomPrice}/month
                                    </div>
                                )}
                            </div>
                        )}
                        
                        <button 
                            className="book-now-btn" 
                            onClick={handleBooking}
                            disabled={!selectedRoom}
                            style={{
                                background: selectedRoom ? 'linear-gradient(135deg, #534AB7 0%, #6B5FD6 100%)' : '#ccc',
                                cursor: selectedRoom ? 'pointer' : 'not-allowed',
                                marginTop: '1rem'
                            }}
                        >
                            {selectedRoom ? `Book ${selectedRoom} at ₹${selectedRoomPrice || pg.price}/month` : 'Select a room first'}
                        </button>
                        
                        {!selectedRoom && (
                            <p className="select-hint" style={{ fontSize: '0.75rem', color: '#f56565', marginTop: '0.5rem' }}>
                                ⚠️ Please select a room type above
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PGDetails;