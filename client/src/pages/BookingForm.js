import React, { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './BookingForm.css';
/* eslint-disable no-unused-vars */

const BookingForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    
    // Removed roomObj since it's not being used
    const { selectedRoom, selectedRoomPrice, pg } = location.state || {};
    
    const BOOKING_FEE = 500;
    const [showPopup, setShowPopup] = useState(true);
    const [formData, setFormData] = useState({
        moveInDate: '',
        duration: 1,
        specialRequests: '',
        studentName: user?.name || '',
        studentPhone: user?.phone || '',
        studentEmail: user?.email || ''
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.moveInDate) newErrors.moveInDate = 'Please select move-in date';
        if (!formData.duration || formData.duration < 1) newErrors.duration = 'Please select duration';
        if (!formData.studentName) newErrors.studentName = 'Please enter your name';
        if (!formData.studentPhone) newErrors.studentPhone = 'Please enter your phone number';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            console.log('Validation failed', errors);
            return;
        }
        
        console.log('Form submitted, navigating to payment with amount:', BOOKING_FEE);
        
        // Navigate directly to payment page with clear data
        navigate('/booking-payment', {
            state: {
                paymentType: 'booking_fee',
                amount: BOOKING_FEE,
                totalAmount: BOOKING_FEE,
                description: `Booking fee for ${pg?.name || 'PG'} - ${selectedRoom}`,
                pgName: pg?.name,
                roomType: selectedRoom,
                moveInDate: formData.moveInDate,
                duration: formData.duration,
                studentName: formData.studentName,
                studentPhone: formData.studentPhone,
                bookingRequest: {
                    pgId: pg?.id,
                    pgName: pg?.name,
                    studentId: user?.id,
                    studentName: formData.studentName,
                    studentPhone: formData.studentPhone,
                    roomType: selectedRoom,
                    monthlyRent: selectedRoomPrice,
                    duration: formData.duration,
                    moveInDate: formData.moveInDate,
                    specialRequests: formData.specialRequests
                }
            }
        });
    };

    if (!pg) {
        return (
            <div className="booking-form-container">
                <div className="error-card">
                    <h2>No PG Selected</h2>
                    <button onClick={() => navigate('/explore')}>Go to Explore</button>
                </div>
            </div>
        );
    }

    return (
        <div className="booking-form-container">
            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <div className="popup-icon">🏠</div>
                        <h3>Booking Information</h3>
                        <p>You are about to book <strong>{pg.name}</strong></p>
                        <p>Room Type: <strong>{selectedRoom}</strong></p>
                        <p>Monthly Rent: <strong>₹{selectedRoomPrice}</strong></p>
                        <div className="booking-fee-notice">
                            <p>💰 Booking Fee: <strong>₹{BOOKING_FEE}</strong></p>
                            <p className="fee-note">(This will be deducted from your first month's rent)</p>
                        </div>
                        <button className="popup-ok-btn" onClick={() => setShowPopup(false)}>
                            OK, Continue
                        </button>
                    </div>
                </div>
            )}

            <div className="booking-form-card">
                <div className="form-header">
                    <h1>📝 Complete Your Booking</h1>
                    <p>Fill in the details to confirm your stay at {pg.name}</p>
                </div>

                <form onSubmit={handleSubmit} className="booking-form">
                    <div className="summary-section">
                        <h3>Selected Room Details</h3>
                        <div className="summary-grid">
                            <div className="summary-item"><span className="label">PG Name:</span><span className="value">{pg.name}</span></div>
                            <div className="summary-item"><span className="label">Room Type:</span><span className="value">{selectedRoom}</span></div>
                            <div className="summary-item"><span className="label">Monthly Rent:</span><span className="value">₹{selectedRoomPrice.toLocaleString()}</span></div>
                            <div className="summary-item"><span className="label">Booking Fee:</span><span className="value">₹{BOOKING_FEE}</span></div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>Student Information</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Full Name *</label>
                                <input type="text" name="studentName" value={formData.studentName} onChange={handleChange} />
                                {errors.studentName && <span className="error">{errors.studentName}</span>}
                            </div>
                            <div className="form-group">
                                <label>Phone Number *</label>
                                <input type="tel" name="studentPhone" value={formData.studentPhone} onChange={handleChange} />
                                {errors.studentPhone && <span className="error">{errors.studentPhone}</span>}
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>Booking Details</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Move-in Date *</label>
                                <input type="date" name="moveInDate" value={formData.moveInDate} onChange={handleChange} />
                                {errors.moveInDate && <span className="error">{errors.moveInDate}</span>}
                            </div>
                            <div className="form-group">
                                <label>Duration (months) *</label>
                                <select name="duration" value={formData.duration} onChange={handleChange}>
                                    {[1,2,3,4,5,6,9,12].map(num => (<option key={num} value={num}>{num} month{num > 1 ? 's' : ''}</option>))}
                                </select>
                                {errors.duration && <span className="error">{errors.duration}</span>}
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Special Requests (Optional)</label>
                            <textarea name="specialRequests" value={formData.specialRequests} onChange={handleChange} rows="2" placeholder="Any specific requirements?" />
                        </div>
                    </div>

                    <div className="payment-summary">
                        <h3>Payment Summary</h3>
                        <div className="summary-row total">
                            <span>Booking Fee to Pay Now:</span>
                            <span>₹{BOOKING_FEE}</span>
                        </div>
                        <p className="payment-note">* Pay ₹{BOOKING_FEE} now to confirm your booking. Monthly rent will be paid after move-in.</p>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="back-btn" onClick={() => navigate(-1)}>← Back</button>
                        <button type="submit" className="proceed-btn">Proceed to Payment →</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookingForm;