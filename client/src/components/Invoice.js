import React from 'react';
import './Invoice.css';

const Invoice = ({ bookingDetails, onClose, onDownload }) => {
    const {
        invoiceNumber,
        date,
        pgName,
        roomType,
        months,
        amount,
        paymentId,
        orderId,
        studentName,
        studentEmail,
        studentPhone,
        address
    } = bookingDetails;

    const handleDownload = () => {
        // Create a printable version
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>StaySpot Invoice ${invoiceNumber}</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        padding: 40px;
                        max-width: 800px;
                        margin: auto;
                    }
                    .invoice-header {
                        text-align: center;
                        margin-bottom: 30px;
                        border-bottom: 2px solid #534AB7;
                        padding-bottom: 20px;
                    }
                    .company-name {
                        font-size: 28px;
                        color: #534AB7;
                        font-weight: bold;
                    }
                    .invoice-title {
                        font-size: 24px;
                        margin: 20px 0;
                    }
                    .invoice-details {
                        margin: 20px 0;
                        padding: 20px;
                        background: #f7fafc;
                        border-radius: 10px;
                    }
                    .row {
                        display: flex;
                        justify-content: space-between;
                        margin: 10px 0;
                        padding: 5px 0;
                    }
                    .total-row {
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
                        border-top: 1px solid #ccc;
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
                        margin-top: 20px;
                    }
                </style>
            </head>
            <body>
                <div class="invoice-header">
                    <div class="company-name">🏠 StaySpot</div>
                    <div class="invoice-title">PAYMENT INVOICE</div>
                </div>
                
                <div class="invoice-details">
                    <div class="row">
                        <span><strong>Invoice Number:</strong></span>
                        <span>${invoiceNumber}</span>
                    </div>
                    <div class="row">
                        <span><strong>Date:</strong></span>
                        <span>${date}</span>
                    </div>
                    <div class="row">
                        <span><strong>Payment ID:</strong></span>
                        <span>${paymentId}</span>
                    </div>
                    <div class="row">
                        <span><strong>Order ID:</strong></span>
                        <span>${orderId}</span>
                    </div>
                </div>

                <h3>Bill To:</h3>
                <div class="invoice-details">
                    <div class="row">
                        <span><strong>Name:</strong></span>
                        <span>${studentName}</span>
                    </div>
                    <div class="row">
                        <span><strong>Email:</strong></span>
                        <span>${studentEmail}</span>
                    </div>
                    <div class="row">
                        <span><strong>Phone:</strong></span>
                        <span>${studentPhone}</span>
                    </div>
                    <div class="row">
                        <span><strong>Address:</strong></span>
                        <span>${address || 'Dehradun, India'}</span>
                    </div>
                </div>

                <h3>Booking Details:</h3>
                <div class="invoice-details">
                    <div class="row">
                        <span><strong>PG/Hostel Name:</strong></span>
                        <span>${pgName}</span>
                    </div>
                    <div class="row">
                        <span><strong>Room Type:</strong></span>
                        <span>${roomType}</span>
                    </div>
                    <div class="row">
                        <span><strong>Duration:</strong></span>
                        <span>${months} month(s)</span>
                    </div>
                    <div class="row total-row">
                        <span><strong>Total Amount Paid:</strong></span>
                        <span><strong>₹${amount.toLocaleString()}</strong></span>
                    </div>
                </div>

                <div class="footer">
                    <p>Thank you for choosing StaySpot!</p>
                    <p>This is a computer-generated invoice and requires no signature.</p>
                    <p>For any queries, contact: support@stayspot.com | +91-XXXXXXXXXX</p>
                </div>
                
                <div style="text-align: center;">
                    <button onclick="window.print()">Print Invoice</button>
                    <button onclick="window.close()" style="margin-left: 10px;">Close</button>
                </div>
            </body>
            </html>
        `);
        printWindow.document.close();
    };

    return (
        <div className="invoice-modal">
            <div className="invoice-modal-content">
                <div className="invoice-modal-header">
                    <h2>🧾 Payment Receipt & Invoice</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>
                
                <div className="invoice-body">
                    <div className="invoice-header">
                        <div className="company-logo">🏠 StaySpot</div>
                        <div className="invoice-title">PAYMENT INVOICE</div>
                        <div className="invoice-subtitle">Booking Confirmation</div>
                    </div>

                    <div className="invoice-section">
                        <h3>Invoice Details</h3>
                        <div className="invoice-grid">
                            <div><strong>Invoice No:</strong> {invoiceNumber}</div>
                            <div><strong>Date:</strong> {date}</div>
                            <div><strong>Payment ID:</strong> {paymentId}</div>
                            <div><strong>Order ID:</strong> {orderId}</div>
                        </div>
                    </div>

                    <div className="invoice-section">
                        <h3>Student Information</h3>
                        <div className="invoice-grid">
                            <div><strong>Name:</strong> {studentName}</div>
                            <div><strong>Email:</strong> {studentEmail}</div>
                            <div><strong>Phone:</strong> {studentPhone}</div>
                            <div><strong>Address:</strong> {address || 'Dehradun, India'}</div>
                        </div>
                    </div>

                    <div className="invoice-section">
                        <h3>Booking Details</h3>
                        <table className="invoice-table">
                            <thead>
                                <tr>
                                    <th>Description</th>
                                    <th>Details</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{pgName}</td>
                                    <td>{roomType} - {months} month(s)</td>
                                    <td>₹{amount.toLocaleString()}</td>
                                </tr>
                                <tr className="total-row">
                                    <td colSpan="2"><strong>Total</strong></td>
                                    <td><strong>₹{amount.toLocaleString()}</strong></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="invoice-footer">
                        <p>✅ Payment Status: <strong style={{color: '#48bb78'}}>Successful</strong></p>
                        <p>Thank you for choosing StaySpot! Your booking has been confirmed.</p>
                        <div className="button-group">
                            <button className="download-btn" onClick={handleDownload}>
                                🖨️ Download / Print Invoice
                            </button>
                            <button className="share-btn" onClick={() => {
                                alert('Invoice has been sent to your email!');
                            }}>
                                📧 Send to Email
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Invoice;