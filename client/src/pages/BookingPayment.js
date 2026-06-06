import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './BookingPayment.css';

const BookingPayment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [razorpayLoaded, setRazorpayLoaded] = useState(false);
    const [showReceipt, setShowReceipt] = useState(false);
    const [receiptData, setReceiptData] = useState(null);
    
    const state = location.state || {};
    console.log('BookingPayment received state:', state);
    
    // Extract payment details from state
    const paymentType = state.paymentType || 'booking_fee';
    const amount = state.amount || state.totalAmount || 500;
    const description = state.description || 'Booking Fee for PG';
    const pgName = state.pgName || 'PG';
    const roomType = state.roomType || 'Standard';
    const moveInDate = state.moveInDate;
    const duration = state.duration;
    const studentName = state.studentName;
    const studentPhone = state.studentPhone;
    const bookingRequest = state.bookingRequest;
    
    const RAZORPAY_KEY_ID = 'rzp_test_SiaqwyEJrTqzIJ';
    const finalAmount = amount;

    useEffect(() => {
    console.log('Payment page loaded. Amount:', finalAmount, 'Type:', paymentType);
    loadRazorpayScript();
    // Auto-trigger payment when page loads
    setTimeout(() => {
        handlePayment();
    }, 500);
    }, [finalAmount, paymentType, handlePayment])  
    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            if (window.Razorpay) {
                console.log('Razorpay already loaded');
                setRazorpayLoaded(true);
                resolve(true);
                return;
            }
            
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => {
                console.log('✅ Razorpay script loaded successfully');
                setRazorpayLoaded(true);
                resolve(true);
            };
            script.onerror = () => {
                console.error('❌ Failed to load Razorpay script');
                alert('Failed to load payment gateway. Please check your internet connection.');
                resolve(false);
            };
            document.body.appendChild(script);
        });
    };

    const createOrder = async () => {
        try {
            console.log('Creating order for amount:', finalAmount);
            
            const response = await axios.post(
                'http://localhost:5000/api/payments/create-order',
                {
                    amount: finalAmount,
                    paymentType: paymentType,
                    description: description,
                    pgName: pgName,
                    roomType: roomType
                }
            );
            console.log('Order created successfully:', response.data);
            return response.data;
        } catch (error) {
            console.error('Order creation error:', error);
            throw new Error(error.response?.data?.message || 'Failed to create order');
        }
    };

    const verifyPayment = async (paymentResponse) => {
        try {
            console.log('Verifying payment:', paymentResponse);
            
            const verificationResponse = await axios.post(
                'http://localhost:5000/api/payments/verify-payment',
                {
                    orderId: paymentResponse.razorpay_order_id,
                    paymentId: paymentResponse.razorpay_payment_id,
                    signature: paymentResponse.razorpay_signature,
                    amount: finalAmount,
                    paymentType: paymentType,
                    pgName: pgName,
                    roomType: roomType
                }
            );
            console.log('Payment verified:', verificationResponse.data);
            return verificationResponse.data;
        } catch (error) {
            console.error('Verification error:', error);
            throw error;
        }
    };

    const generateReceipt = (paymentResponse, verificationResult) => {
        const receipt = {
            receiptNumber: `RCPT${Date.now()}`,
            date: new Date().toLocaleString(),
            paymentId: paymentResponse.razorpay_payment_id,
            orderId: paymentResponse.razorpay_order_id,
            amount: finalAmount,
            paymentType: paymentType,
            pgName: pgName,
            roomType: roomType,
            studentName: localStorage.getItem('user_name') || studentName || 'Student',
            studentPhone: localStorage.getItem('user_phone') || studentPhone || 'Not provided',
            moveInDate: moveInDate,
            duration: duration,
            status: 'Success'
        };
        setReceiptData(receipt);
        setShowReceipt(true);
    };

    const handlePayment = async () => {
        console.log('handlePayment called. Razorpay loaded:', razorpayLoaded);
        
        if (!razorpayLoaded) {
            alert('Payment gateway is still loading. Please wait...');
            return;
        }
        
        setIsProcessing(true);

        try {
            const orderResponse = await createOrder();
            
            if (!orderResponse || !orderResponse.id) {
                throw new Error('Failed to create order');
            }

            const options = {
                key: RAZORPAY_KEY_ID,
                amount: orderResponse.amount,
                currency: orderResponse.currency || 'INR',
                name: 'StaySpot',
                description: description,
                image: 'https://razorpay.com/assets/razorpay-glyph.svg',
                order_id: orderResponse.id,
                handler: async function (response) {
                    console.log('✅ Payment successful:', response);
                    
                    try {
                        const verificationResult = await verifyPayment(response);
                        
                        if (verificationResult.success) {
                            generateReceipt(response, verificationResult);
                            
                            // Save booking to localStorage
                            if (paymentType === 'booking_fee' && bookingRequest) {
                                const allBookings = JSON.parse(localStorage.getItem('all_bookings') || '[]');
                                const newBooking = {
                                    ...bookingRequest,
                                    id: Date.now(),
                                    bookingId: verificationResult.bookingId,
                                    paymentId: response.razorpay_payment_id,
                                    paymentAmount: finalAmount,
                                    status: 'confirmed',
                                    paymentDate: new Date().toISOString()
                                };
                                allBookings.push(newBooking);
                                localStorage.setItem('all_bookings', JSON.stringify(allBookings));
                            }
                            
                            // Also save payment record
                            const allPayments = JSON.parse(localStorage.getItem('student_payments') || '[]');
                            allPayments.push({
                                id: Date.now(),
                                paymentId: response.razorpay_payment_id,
                                amount: finalAmount,
                                type: paymentType,
                                date: new Date().toISOString()
                            });
                            localStorage.setItem('student_payments', JSON.stringify(allPayments));
                            
                        } else {
                            alert('Payment verification failed. Please contact support.');
                        }
                    } catch (error) {
                        console.error('Verification error:', error);
                        alert('Payment verification failed. Please contact support.');
                    }
                    setIsProcessing(false);
                },
                prefill: {
                    name: localStorage.getItem('user_name') || studentName || 'Student',
                    email: localStorage.getItem('user_email') || 'student@example.com',
                    contact: localStorage.getItem('user_phone') || studentPhone || '9999999999'
                },
                notes: {
                    payment_type: paymentType,
                    pg_name: pgName,
                    room_type: roomType
                },
                theme: {
                    color: '#534AB7'
                },
                modal: {
                    ondismiss: function() {
                        console.log('Payment modal closed by user');
                        setIsProcessing(false);
                    }
                }
            };

            const razorpay = new window.Razorpay(options);
            
            razorpay.on('payment.failed', function (response) {
                console.error('Payment failed:', response.error);
                alert(`Payment failed: ${response.error.description || 'Please try again'}`);
                setIsProcessing(false);
            });
            
            razorpay.open();

        } catch (error) {
            console.error('Payment error:', error);
            alert(error.message || 'Something went wrong. Please try again.');
            setIsProcessing(false);
        }
    };

    const handlePrintReceipt = () => {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>StaySpot Payment Receipt</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: auto; }
                    .receipt-header { text-align: center; border-bottom: 3px solid #534AB7; padding-bottom: 20px; margin-bottom: 30px; }
                    .company-name { font-size: 28px; color: #534AB7; font-weight: bold; }
                    .receipt-title { font-size: 24px; margin: 10px 0; }
                    .section { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 8px; }
                    .row { display: flex; justify-content: space-between; margin: 10px 0; padding: 5px 0; }
                    .total { border-top: 2px solid #534AB7; margin-top: 10px; padding-top: 10px; font-weight: bold; font-size: 18px; }
                    .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
                    button { background: #534AB7; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin: 10px; }
                </style>
            </head>
            <body>
                <div class="receipt-header">
                    <div class="company-name">🏠 StaySpot</div>
                    <div class="receipt-title">PAYMENT RECEIPT</div>
                </div>
                <div class="section">
                    <div class="row"><strong>Receipt Number:</strong> <span>${receiptData.receiptNumber}</span></div>
                    <div class="row"><strong>Date & Time:</strong> <span>${receiptData.date}</span></div>
                    <div class="row"><strong>Payment ID:</strong> <span>${receiptData.paymentId}</span></div>
                    <div class="row"><strong>Status:</strong> <span style="color:#48bb78;">✅ Success</span></div>
                </div>
                <div class="section">
                    <h3>Student Information</h3>
                    <div class="row"><strong>Name:</strong> <span>${receiptData.studentName}</span></div>
                    <div class="row"><strong>Phone:</strong> <span>${receiptData.studentPhone}</span></div>
                </div>
                <div class="section">
                    <h3>Payment Details</h3>
                    <div class="row"><strong>PG Name:</strong> <span>${receiptData.pgName}</span></div>
                    <div class="row"><strong>Room Type:</strong> <span>${receiptData.roomType}</span></div>
                    <div class="row total"><strong>Amount Paid:</strong> <strong>₹${receiptData.amount.toLocaleString()}</strong></div>
                </div>
                <div class="footer">
                    <p>Thank you for choosing StaySpot!</p>
                    <p>This is a computer-generated receipt.</p>
                </div>
                <div style="text-align: center;">
                    <button onclick="window.print()">🖨️ Print Receipt</button>
                    <button onclick="window.close()">❌ Close</button>
                </div>
            </body>
            </html>
        `);
        printWindow.document.close();
    };

    const ReceiptModal = () => (
        <div className="receipt-modal-overlay">
            <div className="receipt-modal-content">
                <div className="receipt-modal-header">
                    <h2>🧾 Payment Receipt</h2>
                    <button className="close-receipt-btn" onClick={() => {
                        setShowReceipt(false);
                        navigate('/bookings');
                    }}>×</button>
                </div>
                
                <div id="receipt-content" className="receipt-body">
                    <div className="receipt-header-section">
                        <div className="receipt-logo">🏠 StaySpot</div>
                        <div className="receipt-title">PAYMENT RECEIPT</div>
                    </div>
                    
                    <div className="receipt-section">
                        <h4>Receipt Details</h4>
                        <div className="receipt-row"><span>Receipt No:</span><span>{receiptData?.receiptNumber}</span></div>
                        <div className="receipt-row"><span>Date:</span><span>{receiptData?.date}</span></div>
                        <div className="receipt-row"><span>Payment ID:</span><span>{receiptData?.paymentId}</span></div>
                        <div className="receipt-row"><span>Status:</span><span className="success-text">✅ Successful</span></div>
                    </div>
                    
                    <div className="receipt-section">
                        <h4>Student Details</h4>
                        <div className="receipt-row"><span>Name:</span><span>{receiptData?.studentName}</span></div>
                        <div className="receipt-row"><span>Phone:</span><span>{receiptData?.studentPhone}</span></div>
                    </div>
                    
                    <div className="receipt-section">
                        <h4>Booking Details</h4>
                        <div className="receipt-row"><span>PG Name:</span><span>{receiptData?.pgName}</span></div>
                        <div className="receipt-row"><span>Room Type:</span><span>{receiptData?.roomType}</span></div>
                        <div className="receipt-row total"><span>Amount Paid:</span><span>₹{receiptData?.amount?.toLocaleString()}</span></div>
                    </div>
                    
                    <div className="receipt-footer">
                        <p>Thank you for choosing StaySpot!</p>
                        <p className="receipt-note">This is a computer-generated receipt.</p>
                    </div>
                </div>
                
                <div className="receipt-actions">
                    <button className="print-receipt-btn" onClick={handlePrintReceipt}>🖨️ Print Receipt</button>
                    <button className="close-receipt-btn-secondary" onClick={() => {
                        setShowReceipt(false);
                        navigate('/bookings');
                    }}>Close</button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="booking-container">
            <div className="booking-card">
                <div className="payment-header">
                    <h1>💳 {paymentType === 'booking_fee' ? 'Booking Fee Payment' : 'Rent Payment'}</h1>
                    <p>Complete your payment securely via Razorpay</p>
                </div>
                
                <div className="payment-details">
                    <div className="detail-card">
                        <div className="detail-row">
                            <span>PG Name:</span>
                            <strong>{pgName}</strong>
                        </div>
                        <div className="detail-row">
                            <span>Room Type:</span>
                            <strong>{roomType}</strong>
                        </div>
                        <div className="detail-row total">
                            <span>Amount to Pay:</span>
                            <strong>₹{finalAmount.toLocaleString()}</strong>
                        </div>
                    </div>
                    
                    <div className="info-box">
                        <p>🔒 Secure payment powered by Razorpay</p>
                        <p>✅ Test Card: <strong>4242 4242 4242 4242</strong></p>
                        <p>📅 Expiry: <strong>12/25</strong> | CVV: <strong>123</strong></p>
                        <p>📱 Any OTP: <strong>123456</strong></p>
                    </div>
                    
                    <button 
                        onClick={handlePayment} 
                        className="pay-now-btn"
                        disabled={isProcessing || !razorpayLoaded}
                    >
                        {isProcessing ? '⏳ Processing...' : !razorpayLoaded ? 'Loading Payment Gateway...' : `💳 Pay ₹${finalAmount} Now`}
                    </button>
                    
                    <button className="back-btn" onClick={() => navigate(-1)}>
                        ← Go Back
                    </button>
                </div>
            </div>
            
            {showReceipt && receiptData && <ReceiptModal />}
        </div>
    );
};

export default BookingPayment;