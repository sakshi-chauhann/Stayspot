import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Bookings.css';

const Bookings = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            loadBookings();
        } else {
            setLoading(false);
        }
    }, [user]);

    const loadBookings = () => {
        // Load confirmed bookings from localStorage
        const allBookings = JSON.parse(localStorage.getItem('all_bookings') || '[]');
        const userBookings = allBookings.filter(b => b.studentId === user?.id && b.status === 'confirmed');
        
        if (userBookings.length > 0) {
            // Add payment records to each booking
            const bookingsWithPayments = userBookings.map(booking => {
                // Generate monthly payments for the duration
                const payments = [];
                const moveIn = new Date(booking.moveInDate);
                
                for (let i = 0; i < booking.duration; i++) {
                    const paymentDate = new Date(moveIn);
                    paymentDate.setMonth(moveIn.getMonth() + i + 1);
                    const monthName = paymentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
                    
                    // Check if payment exists
                    const allPayments = JSON.parse(localStorage.getItem('student_payments') || '[]');
                    const existingPayment = allPayments.find(p => p.bookingId === booking.id && p.month === monthName);
                    
                    payments.push({
                        month: monthName,
                        amount: booking.monthlyRent,
                        dueDate: paymentDate.toISOString().split('T')[0],
                        status: existingPayment?.status || 'pending',
                        paidDate: existingPayment?.paidDate || null
                    });
                }
                
                return { ...booking, payments: payments };
            });
            setBookings(bookingsWithPayments);
        } else {
            // Demo data for testing
            setBookings([
                {
                    id: 1,
                    pgName: 'Solitaire PG for Girls',
                    roomType: 'Double Sharing',
                    monthlyRent: 8000,
                    duration: 6,
                    moveInDate: '2026-04-01',
                    status: 'confirmed',
                    payments: [
                        { month: 'May 2026', amount: 8000, dueDate: '2026-05-05', status: 'pending', paidDate: null },
                        { month: 'June 2026', amount: 8000, dueDate: '2026-06-05', status: 'pending', paidDate: null }
                    ]
                }
            ]);
        }
        setLoading(false);
    };

    const calculateLateFee = (dueDate) => {
        const today = new Date();
        const due = new Date(dueDate);
        const daysLate = Math.floor((today - due) / (1000 * 60 * 60 * 24));
        if (daysLate <= 5) return 0;
        return (daysLate - 5) * 50;
    };

    const handlePayRent = (booking, payment) => {
        const lateFee = calculateLateFee(payment.dueDate);
        const totalAmount = payment.amount + lateFee;
        
        navigate('/booking-payment', {
            state: {
                paymentType: 'monthly_rent',
                bookingId: booking.id,
                pgName: booking.pgName,
                roomType: booking.roomType,
                month: payment.month,
                amount: payment.amount,
                lateFee: lateFee,
                totalAmount: totalAmount,
                dueDate: payment.dueDate,
                isLatePayment: lateFee > 0
            }
        });
    };

    const getStatusBadge = (status) => {
        switch(status) {
            case 'paid': return <span className="status-badge paid">✓ Paid</span>;
            case 'pending': return <span className="status-badge pending">⏳ Pending</span>;
            case 'overdue': return <span className="status-badge overdue">❗ Overdue</span>;
            default: return <span className="status-badge">{status}</span>;
        }
    };

    if (!user) {
        return (
            <div className="bookings-container">
                <div className="error-card">
                    <h2>Please Login</h2>
                    <button onClick={() => navigate('/login')}>Sign In</button>
                </div>
            </div>
        );
    }

    if (loading) {
        return <div className="bookings-container">Loading your bookings...</div>;
    }

    return (
        <div className="bookings-container">
            <div className="bookings-header">
                <h1>📋 My Bookings</h1>
                <p>View your active bookings and pay monthly rent</p>
            </div>

            {bookings.length === 0 ? (
                <div className="empty-state">
                    <p>No bookings yet.</p>
                    <button onClick={() => navigate('/explore')} className="explore-btn">Explore PGs</button>
                </div>
            ) : (
                <div className="bookings-list">
                    {bookings.map((booking) => (
                        <div key={booking.id} className="booking-card">
                            <div className="booking-header">
                                <h3>🏠 {booking.pgName}</h3>
                                <span className={`booking-status ${booking.status}`}>{booking.status.toUpperCase()}</span>
                            </div>
                            
                            <div className="booking-info">
                                <div className="info-row"><span className="label">Room Type:</span><span className="value">{booking.roomType}</span></div>
                                <div className="info-row"><span className="label">Monthly Rent:</span><span className="value">₹{booking.monthlyRent.toLocaleString()}</span></div>
                                <div className="info-row"><span className="label">Move-in Date:</span><span className="value">{booking.moveInDate}</span></div>
                                <div className="info-row"><span className="label">Duration:</span><span className="value">{booking.duration} month(s)</span></div>
                            </div>

                            <div className="payment-section">
                                <h4>💰 Monthly Rent Payments</h4>
                                <div className="payment-table-container">
                                    <table className="payment-table">
                                        <thead><tr><th>Month</th><th>Amount</th><th>Due Date</th><th>Status</th><th>Action</th></tr></thead>
                                        <tbody>
                                            {booking.payments.map((payment, idx) => {
                                                const lateFee = calculateLateFee(payment.dueDate);
                                                const totalAmount = payment.amount + lateFee;
                                                const isOverdue = new Date(payment.dueDate) < new Date() && payment.status !== 'paid';
                                                
                                                return (
                                                    <tr key={idx} className={isOverdue ? 'overdue-row' : ''}>
                                                        <td>{payment.month}</td>
                                                        <td>₹{payment.amount.toLocaleString()}</td>
                                                        <td>{payment.dueDate}</td>
                                                        <td>{getStatusBadge(payment.status)}</td>
                                                        <td>
                                                            {payment.status !== 'paid' && (
                                                                <button className="pay-rent-btn" onClick={() => handlePayRent(booking, payment)}>
                                                                    {lateFee > 0 ? `Pay ₹${totalAmount} (incl. ₹${lateFee} late fee)` : `Pay ₹${payment.amount}`}
                                                                </button>
                                                            )}
                                                            {payment.status === 'paid' && <span className="paid-date">✓ Paid</span>}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Bookings;