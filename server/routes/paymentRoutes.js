const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');

console.log('Initializing Razorpay with:', {
    key_id: process.env.RAZORPAY_KEY_ID,
    has_secret: !!process.env.RAZORPAY_KEY_SECRET
});

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Test endpoint
router.get('/test', async (req, res) => {
    try {
        console.log('Testing Razorpay connection...');
        const test = await razorpay.orders.all({ count: 1 });
        res.json({ success: true, message: 'Razorpay is working', test });
    } catch (error) {
        console.error('Razorpay test failed:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Create order
router.post('/create-order', async (req, res) => {
    try {
        console.log('Creating order with data:', req.body);
        console.log('Using Razorpay credentials:', {
            key_id: process.env.RAZORPAY_KEY_ID,
            has_secret: !!process.env.RAZORPAY_KEY_SECRET
        });
        
        const { amount, bookingId } = req.body;
        
        const options = {
            amount: amount * 100, // Convert to paise
            currency: 'INR',
            receipt: `booking_${bookingId}`
        };
        
        console.log('Order options:', options);
        const order = await razorpay.orders.create(options);
        console.log('Order created successfully:', order);
        res.json(order);
    } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({ message: error.message, error: error.toString() });
    }
});

// Verify payment
router.post('/verify-payment', async (req, res) => {
    try {
        console.log('Verifying payment with data:', req.body);
        const { orderId, paymentId, signature, bookingId } = req.body;
        
        // Verify signature
        const crypto = require('crypto');
        const generatedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(orderId + '|' + paymentId)
            .digest('hex');
        
        if (generatedSignature !== signature) {
            return res.status(400).json({ message: 'Invalid payment signature' });
        }
        
        // Update booking
        await Booking.findByIdAndUpdate(bookingId, {
            paymentStatus: 'paid',
            paymentId: paymentId,
            status: 'confirmed'
        });
        
        res.json({ success: true, message: 'Payment verified successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;