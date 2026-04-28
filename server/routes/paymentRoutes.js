const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const auth = require('../middleware/auth');

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

console.log('✅ Razorpay initialized with:', {
    key_id: process.env.RAZORPAY_KEY_ID ? 'Present' : 'Missing',
    key_secret: process.env.RAZORPAY_KEY_SECRET ? 'Present' : 'Missing'
});

// Helper function to calculate late fee
const calculateLateFee = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const daysLate = Math.floor((today - due) / (1000 * 60 * 60 * 24));
    
    if (daysLate <= 5) return 0;
    // ₹50 per day after 5 days late
    return (daysLate - 5) * 50;
};

// Create order endpoint (supports rent payment with late fee)
router.post('/create-order', auth, async (req, res) => {
    try {
        let { amount, pgName, roomType, months, paymentType, dueDate, lateFee } = req.body;
        
        // If this is a rent payment with late fee, add the late fee to amount
        if (paymentType === 'monthly_rent' && lateFee && lateFee > 0) {
            amount = amount + lateFee;
            console.log(`Adding late fee of ₹${lateFee}. Total amount: ₹${amount}`);
        }
        
        // Validate amount
        if (!amount || amount <= 0) {
            return res.status(400).json({ message: 'Invalid amount' });
        }

        const options = {
            amount: Math.round(amount * 100), // Convert to paise and ensure integer
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
            payment_capture: 1 // Auto-capture payment
        };
        
        console.log('Creating order with options:', options);
        const order = await razorpay.orders.create(options);
        console.log('Order created successfully:', order.id);
        
        res.json({
            id: order.id,
            amount: order.amount,
            currency: order.currency,
            key_id: process.env.RAZORPAY_KEY_ID
        });
    } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({ 
            message: 'Failed to create order', 
            error: error.message 
        });
    }
});

// Verify payment endpoint (supports rent payment with late fee)
router.post('/verify-payment', auth, async (req, res) => {
    try {
        const { 
            orderId, 
            paymentId, 
            signature, 
            amount, 
            pgName, 
            roomType, 
            months,
            paymentType,
            month,
            bookingId,
            lateFee,
            dueDate
        } = req.body;
        
        // Verify signature
        const generatedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(orderId + '|' + paymentId)
            .digest('hex');
        
        if (generatedSignature !== signature) {
            console.error('Signature mismatch:', { generatedSignature, receivedSignature: signature });
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid payment signature' 
            });
        }
        
        // Calculate late fee again to verify
        let calculatedLateFee = 0;
        if (paymentType === 'monthly_rent' && dueDate) {
            calculatedLateFee = calculateLateFee(dueDate);
        }
        
        // Save payment record to localStorage (for demo)
        const paymentRecord = {
            id: `pay_${Date.now()}`,
            orderId,
            paymentId,
            amount: paymentType === 'monthly_rent' ? amount : amount,
            lateFee: calculatedLateFee,
            totalPaid: paymentType === 'monthly_rent' ? amount + calculatedLateFee : amount,
            paymentType: paymentType || 'booking',
            bookingId: bookingId || `BOOK_${Date.now()}`,
            pgName,
            roomType,
            month: month || null,
            status: 'success',
            userId: req.user?.id,
            timestamp: new Date().toISOString()
        };
        
        // Save to localStorage
        const existingPayments = JSON.parse(localStorage.getItem('all_payments') || '[]');
        existingPayments.push(paymentRecord);
        localStorage.setItem('all_payments', JSON.stringify(existingPayments));
        
        // If this is a monthly rent payment, update the booking payment status
        if (paymentType === 'monthly_rent' && bookingId) {
            const allBookings = JSON.parse(localStorage.getItem('all_bookings') || '[]');
            const updatedBookings = allBookings.map(booking => {
                if (booking.id == bookingId && booking.payments) {
                    const updatedPayments = booking.payments.map(p => {
                        if (p.month === month) {
                            return { 
                                ...p, 
                                status: 'paid', 
                                paidDate: new Date().toISOString().split('T')[0],
                                lateFeePaid: calculatedLateFee
                            };
                        }
                        return p;
                    });
                    return { ...booking, payments: updatedPayments };
                }
                return booking;
            });
            localStorage.setItem('all_bookings', JSON.stringify(updatedBookings));
        }
        
        console.log('Payment verified and saved successfully:', {
            orderId,
            paymentId,
            amount,
            lateFee: calculatedLateFee,
            totalPaid: amount + calculatedLateFee,
            paymentType,
            userId: req.user?.id
        });
        
        res.json({ 
            success: true, 
            message: 'Payment verified successfully',
            paymentId: paymentId,
            bookingId: paymentRecord.bookingId,
            lateFee: calculatedLateFee,
            totalAmount: amount + calculatedLateFee
        });
    } catch (error) {
        console.error('Payment verification error:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
});

// Test endpoint
router.get('/test', async (req, res) => {
    try {
        const orders = await razorpay.orders.all({ count: 1 });
        res.json({ 
            success: true, 
            message: 'Razorpay is configured correctly',
            key_id: process.env.RAZORPAY_KEY_ID ? 'Present' : 'Missing'
        });
    } catch (error) {
        console.error('Razorpay test failed:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message,
            suggestion: 'Check your RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env file'
        });
    }
});

// Get late fee for a due date (API endpoint)
router.post('/calculate-late-fee', auth, async (req, res) => {
    try {
        const { dueDate } = req.body;
        const lateFee = calculateLateFee(dueDate);
        res.json({ 
            success: true, 
            dueDate: dueDate,
            daysLate: Math.floor((new Date() - new Date(dueDate)) / (1000 * 60 * 60 * 24)),
            lateFee: lateFee,
            message: lateFee > 0 ? `Late fee of ₹${lateFee} applied` : 'No late fee'
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;