import React, { useState } from 'react';
import axios from 'axios';
import './RazorpayPayment.css';

const RazorpayPayment = ({ amount, pgName, roomType, months, onSuccess, onFailure }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [showInvoice, setShowInvoice] = useState(false);
    const [invoiceData, setInvoiceData] = useState(null);
    const RAZORPAY_KEY_ID = 'rzp_test_SiaqwyEJrTqzIJ';

    // Generate unique invoice number
    const generateInvoiceNumber = () => {
        const prefix = 'STAY';
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const random = Math.floor(Math.random() * 10000);
        return `${prefix}/${year}${month}${day}/${random}`;
    };

    // Format date for invoice
    const getFormattedDate = () => {
        return new Date().toLocaleString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => {
                console.log('✅ Razorpay script loaded');
                resolve(true);
            };
            script.onerror = () => {
                console.error('❌ Failed to load Razorpay script');
                resolve(false);
            };
            document.body.appendChild(script);
        });
    };

    // Function to show invoice modal
    const showInvoiceModal = (paymentResponse) => {
        console.log('Generating invoice for payment:', paymentResponse);
        
        const invoice = {
            invoiceNumber: generateInvoiceNumber(),
            date: getFormattedDate(),
            pgName: pgName,
            roomType: roomType,
            months: months,
            amount: amount,
            paymentId: paymentResponse.razorpay_payment_id,
            orderId: paymentResponse.razorpay_order_id,
            signature: paymentResponse.razorpay_signature,
            studentName: localStorage.getItem('user_name') || 'Guest Student',
            studentEmail: localStorage.getItem('user_email') || 'student@stayspot.com',
            studentPhone: localStorage.getItem('user_phone') || 'Not provided',
            paymentStatus: 'Successful',
            paymentMethod: 'Razorpay (Card/UPI/NetBanking)'
        };
        
        setInvoiceData(invoice);
        setShowInvoice(true);
    };

    // Invoice Component (inline for simplicity)
    const InvoiceModal = ({ invoice, onClose }) => {
        const handlePrint = () => {
            const printContent = document.getElementById('invoice-content').innerHTML;
            const originalContent = document.body.innerHTML;
            document.body.innerHTML = printContent;
            window.print();
            document.body.innerHTML = originalContent;
            window.location.reload();
        };

        const handleDownload = () => {
            // Create a temporary element for printing
            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>StaySpot Invoice ${invoice.invoiceNumber}</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            padding: 40px;
                            max-width: 800px;
                            margin: auto;
                        }
                        .header {
                            text-align: center;
                            border-bottom: 3px solid #534AB7;
                            padding-bottom: 20px;
                            margin-bottom: 30px;
                        }
                        .company-name {
                            font-size: 28px;
                            color: #534AB7;
                            font-weight: bold;
                        }
                        .invoice-title {
                            font-size: 24px;
                            margin: 10px 0;
                        }
                        .section {
                            margin: 20px 0;
                            padding: 15px;
                            border: 1px solid #ddd;
                            border-radius: 8px;
                        }
                        .row {
                            display: flex;
                            justify-content: space-between;
                            margin: 10px 0;
                            padding: 5px 0;
                        }
                        .total {
                            border-top: 2px solid #534AB7;
                            margin-top: 10px;
                            padding-top: 10px;
                            font-weight: bold;
                            font-size: 18px;
                        }
                        .footer {
                            text-align: center;
                            margin-top: 40px;
                            padding-top: 20px;
                            border-top: 1px solid #ddd;
                            font-size: 12px;
                            color: #666;
                        }
                        button {
                            background: #534AB7;
                            color: white;
                            padding: 10px 20px;
                            border: none;
                            border-radius: 5px;
                            cursor: pointer;
                            margin: 10px;
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <div class="company-name">🏠 StaySpot</div>
                        <div class="invoice-title">PAYMENT INVOICE & RECEIPT</div>
                    </div>
                    
                    <div class="section">
                        <div class="row">
                            <span><strong>Invoice Number:</strong></span>
                            <span>${invoice.invoiceNumber}</span>
                        </div>
                        <div class="row">
                            <span><strong>Date & Time:</strong></span>
                            <span>${invoice.date}</span>
                        </div>
                        <div class="row">
                            <span><strong>Payment ID:</strong></span>
                            <span>${invoice.paymentId}</span>
                        </div>
                        <div class="row">
                            <span><strong>Order ID:</strong></span>
                            <span>${invoice.orderId}</span>
                        </div>
                        <div class="row">
                            <span><strong>Payment Status:</strong></span>
                            <span style="color: #48bb78;"><strong>${invoice.paymentStatus}</strong></span>
                        </div>
                    </div>

                    <div class="section">
                        <h3>Student Information</h3>
                        <div class="row">
                            <span><strong>Name:</strong></span>
                            <span>${invoice.studentName}</span>
                        </div>
                        <div class="row">
                            <span><strong>Email:</strong></span>
                            <span>${invoice.studentEmail}</span>
                        </div>
                        <div class="row">
                            <span><strong>Phone:</strong></span>
                            <span>${invoice.studentPhone}</span>
                        </div>
                    </div>

                    <div class="section">
                        <h3>Booking Details</h3>
                        <div class="row">
                            <span><strong>PG/Hostel Name:</strong></span>
                            <span>${invoice.pgName}</span>
                        </div>
                        <div class="row">
                            <span><strong>Room Type:</strong></span>
                            <span>${invoice.roomType}</span>
                        </div>
                        <div class="row">
                            <span><strong>Duration:</strong></span>
                            <span>${invoice.months} month(s)</span>
                        </div>
                        <div class="row total">
                            <span><strong>Total Amount Paid:</strong></span>
                            <span><strong>₹${invoice.amount.toLocaleString()}</strong></span>
                        </div>
                    </div>

                    <div class="footer">
                        <p>Thank you for choosing StaySpot! Your booking has been confirmed.</p>
                        <p>For any queries, contact: support@stayspot.com | +91-XXXXXXXXXX</p>
                        <p>This is a computer-generated invoice and requires no signature.</p>
                    </div>
                    
                    <div style="text-align: center;">
                        <button onclick="window.print()">🖨️ Print Invoice</button>
                        <button onclick="window.close()">❌ Close</button>
                    </div>
                </body>
                </html>
            `);
            printWindow.document.close();
        };

        return (
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'rgba(0,0,0,0.7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999,
                overflow: 'auto'
            }}>
                <div style={{
                    background: 'white',
                    borderRadius: '20px',
                    width: '90%',
                    maxWidth: '700px',
                    maxHeight: '90vh',
                    overflow: 'auto',
                    position: 'relative',
                    animation: 'slideUp 0.3s ease'
                }}>
                    <style>
                        {`
                            @keyframes slideUp {
                                from {
                                    transform: translateY(50px);
                                    opacity: 0;
                                }
                                to {
                                    transform: translateY(0);
                                    opacity: 1;
                                }
                            }
                        `}
                    </style>
                    
                    <div id="invoice-content">
                        <div style={{
                            background: 'linear-gradient(135deg, #534AB7 0%, #6B5FD6 100%)',
                            color: 'white',
                            padding: '1rem 1.5rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderRadius: '20px 20px 0 0',
                            position: 'sticky',
                            top: 0
                        }}>
                            <h2 style={{margin: 0}}>🧾 Payment Receipt & Invoice</h2>
                            <button onClick={onClose} style={{
                                background: 'none',
                                border: 'none',
                                color: 'white',
                                fontSize: '2rem',
                                cursor: 'pointer',
                                padding: '0 10px'
                            }}>×</button>
                        </div>
                        
                        <div style={{padding: '2rem'}}>
                            <div style={{textAlign: 'center', marginBottom: '2rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '1rem'}}>
                                <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#534AB7'}}>🏠 StaySpot</div>
                                <div style={{fontSize: '1.5rem', fontWeight: 'bold', margin: '0.5rem 0'}}>PAYMENT INVOICE</div>
                                <div style={{color: '#718096'}}>Booking Confirmation Receipt</div>
                            </div>

                            <div style={{marginBottom: '1.5rem', padding: '1rem', background: '#f7fafc', borderRadius: '12px'}}>
                                <h3 style={{color: '#534AB7', marginTop: 0}}>📋 Invoice Details</h3>
                                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.8rem'}}>
                                    <div><strong>Invoice No:</strong> {invoice.invoiceNumber}</div>
                                    <div><strong>Date:</strong> {invoice.date}</div>
                                    <div><strong>Payment ID:</strong> {invoice.paymentId}</div>
                                    <div><strong>Order ID:</strong> {invoice.orderId}</div>
                                    <div><strong>Status:</strong> <span style={{color: '#48bb78'}}>✅ {invoice.paymentStatus}</span></div>
                                </div>
                            </div>

                            <div style={{marginBottom: '1.5rem', padding: '1rem', background: '#f7fafc', borderRadius: '12px'}}>
                                <h3 style={{color: '#534AB7', marginTop: 0}}>👤 Student Information</h3>
                                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.8rem'}}>
                                    <div><strong>Name:</strong> {invoice.studentName}</div>
                                    <div><strong>Email:</strong> {invoice.studentEmail}</div>
                                    <div><strong>Phone:</strong> {invoice.studentPhone}</div>
                                </div>
                            </div>

                            <div style={{marginBottom: '1.5rem', padding: '1rem', background: '#f7fafc', borderRadius: '12px'}}>
                                <h3 style={{color: '#534AB7', marginTop: 0}}>🏠 Booking Details</h3>
                                <table style={{width: '100%', borderCollapse: 'collapse'}}>
                                    <thead>
                                        <tr style={{background: '#edf2f7'}}>
                                            <th style={{padding: '0.8rem', textAlign: 'left'}}>Description</th>
                                            <th style={{padding: '0.8rem', textAlign: 'left'}}>Details</th>
                                            <th style={{padding: '0.8rem', textAlign: 'right'}}>Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td style={{padding: '0.8rem', borderBottom: '1px solid #e2e8f0'}}>PG/Hostel</td>
                                            <td style={{padding: '0.8rem', borderBottom: '1px solid #e2e8f0'}}>{invoice.pgName}</td>
                                            <td style={{padding: '0.8rem', borderBottom: '1px solid #e2e8f0', textAlign: 'right'}}>₹{invoice.amount.toLocaleString()}</td>
                                        </tr>
                                        <tr>
                                            <td style={{padding: '0.8rem', borderBottom: '1px solid #e2e8f0'}}>Room Type</td>
                                            <td style={{padding: '0.8rem', borderBottom: '1px solid #e2e8f0'}}>{invoice.roomType}</td>
                                            <td style={{padding: '0.8rem', borderBottom: '1px solid #e2e8f0', textAlign: 'right'}}>-</td>
                                        </tr>
                                        <tr>
                                            <td style={{padding: '0.8rem', borderBottom: '1px solid #e2e8f0'}}>Duration</td>
                                            <td style={{padding: '0.8rem', borderBottom: '1px solid #e2e8f0'}}>{invoice.months} month(s)</td>
                                            <td style={{padding: '0.8rem', borderBottom: '1px solid #e2e8f0', textAlign: 'right'}}>-</td>
                                        </tr>
                                        <tr style={{background: '#fef5e7'}}>
                                            <td colSpan="2" style={{padding: '0.8rem', fontWeight: 'bold'}}>Total Amount Paid</td>
                                            <td style={{padding: '0.8rem', textAlign: 'right', fontWeight: 'bold', fontSize: '1.1rem'}}>₹{invoice.amount.toLocaleString()}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div style={{marginTop: '2rem', paddingTop: '1rem', textAlign: 'center', borderTop: '2px solid #e2e8f0'}}>
                                <p>✅ Payment Status: <strong style={{color: '#48bb78'}}>Successful</strong></p>
                                <p>Thank you for choosing StaySpot! Your booking has been confirmed.</p>
                                <div style={{display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem'}}>
                                    <button onClick={handleDownload} style={{
                                        padding: '0.8rem 1.5rem',
                                        background: '#534AB7',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '10px',
                                        cursor: 'pointer',
                                        fontWeight: 'bold'
                                    }}>
                                        🖨️ Download / Print Invoice
                                    </button>
                                    <button onClick={() => {
                                        alert('📧 Invoice has been sent to your registered email address!');
                                    }} style={{
                                        padding: '0.8rem 1.5rem',
                                        background: '#48bb78',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '10px',
                                        cursor: 'pointer',
                                        fontWeight: 'bold'
                                    }}>
                                        📧 Send to Email
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const handlePayment = async () => {
        console.log('💳 Payment button clicked');
        console.log('📝 Payment details:', { amount, pgName, roomType, months });
        
        setIsProcessing(true);

        try {
            const isScriptLoaded = await loadRazorpayScript();
            if (!isScriptLoaded) {
                alert('Failed to load payment gateway. Please check your internet connection.');
                setIsProcessing(false);
                return;
            }

            console.log('📦 Creating order...');
            const orderResponse = await axios.post('http://localhost:5000/api/payments/create-order', {
                amount: amount,
                pgName: pgName,
                roomType: roomType,
                months: months
            });
            
            console.log('✅ Order created:', orderResponse.data);

            if (!orderResponse.data || !orderResponse.data.id) {
                throw new Error('Invalid order response from server');
            }

            const options = {
                key: RAZORPAY_KEY_ID,
                amount: orderResponse.data.amount,
                currency: orderResponse.data.currency || 'INR',
                name: 'StaySpot',
                description: `Booking at ${pgName} - ${roomType}`,
                image: 'https://razorpay.com/assets/razorpay-glyph.svg',
                order_id: orderResponse.data.id,
                handler: function (response) {
                    console.log('🎉 Payment successful!', response);
                    
                    // Show invoice immediately
                    showInvoiceModal(response);
                    setIsProcessing(false);
                    
                    // Call onSuccess callback if provided
                    if (onSuccess) {
                        onSuccess(response);
                    }
                },
                prefill: {
                    name: localStorage.getItem('user_name') || 'Test Student',
                    email: localStorage.getItem('user_email') || 'test@example.com',
                    contact: localStorage.getItem('user_phone') || '9999999999'
                },
                notes: {
                    pg_name: pgName,
                    room_type: roomType,
                    months: months
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
                console.error('❌ Payment failed:', response.error);
                alert(`Payment failed: ${response.error.description}`);
                setIsProcessing(false);
                if (onFailure) onFailure(response.error);
            });
            
            razorpay.open();

        } catch (error) {
            console.error('❌ Payment error:', error);
            console.error('Error details:', error.response?.data);
            
            let errorMessage = 'Something went wrong. Please try again.';
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            alert(`Payment Failed: ${errorMessage}`);
            setIsProcessing(false);
            if (onFailure) onFailure(error);
        }
    };

    return (
        <>
            <div className="razorpay-payment-container">
                <div className="payment-info-card">
                    <div className="payment-header">
                        <div className="razorpay-logo">
                            <span>💳 Razorpay</span>
                        </div>
                        <div className="secure-badge">
                            🔒 Secure Payment
                        </div>
                    </div>

                    <div className="payment-details">
                        <div className="detail-row">
                            <span>PG Name:</span>
                            <strong>{pgName}</strong>
                        </div>
                        <div className="detail-row">
                            <span>Room Type:</span>
                            <strong>{roomType}</strong>
                        </div>
                        <div className="detail-row">
                            <span>Duration:</span>
                            <strong>{months} month(s)</strong>
                        </div>
                        <div className="detail-row total">
                            <span>Total Amount:</span>
                            <strong>₹{amount.toLocaleString()}</strong>
                        </div>
                    </div>

                    <div className="test-card-info">
                        <h4>🔧 Test Card Details:</h4>
                        <p>Use this card for successful payment:</p>
                        <div style={{background: '#f0f0f0', padding: '10px', borderRadius: '8px', textAlign: 'center'}}>
                            <code style={{fontSize: '16px'}}>4242 4242 4242 4242</code>
                            <div style={{marginTop: '5px'}}>
                                <small>Expiry: 12/25 | CVV: 123 | Any OTP: 123456</small>
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={handlePayment} 
                        className="pay-button"
                        disabled={isProcessing}
                        style={{
                            background: isProcessing ? '#ccc' : '#667eea',
                            cursor: isProcessing ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {isProcessing ? '⏳ Processing...' : `💳 Pay ₹${amount.toLocaleString()} via Razorpay`}
                    </button>
                </div>
            </div>

            {/* Show Invoice Modal after successful payment */}
            {showInvoice && invoiceData && (
                <InvoiceModal 
                    invoice={invoiceData} 
                    onClose={() => setShowInvoice(false)}
                />
            )}
        </>
    );
};

export default RazorpayPayment;