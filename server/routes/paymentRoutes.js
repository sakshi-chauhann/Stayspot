const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_SiaqwyEJrTqzIJ',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'NxUOONKHKAK1wj408O5eDa6L'
});

console.log('✅ Razorpay initialized');

// Create order endpoint
router.post('/create-order', async (req, res) => {
    try {
        const { amount } = req.body;
        
        console.log('Creating order for amount:', amount);
        
        const options = {
            amount: Math.round(amount * 100),
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
            payment_capture: 1
        };
        
        const order = await razorpay.orders.create(options);
        console.log('Order created:', order.id);
        
        res.json({
            id: order.id,
            amount: order.amount,
            currency: order.currency,
            key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_SiaqwyEJrTqzIJ'
        });
    } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({ 
            message: 'Failed to create order', 
            error: error.message 
        });
    }
});

// Verify payment endpoint
router.post('/verify-payment', async (req, res) => {
    try {
        const { orderId, paymentId, signature } = req.body;
        
        const generatedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'NxUOONKHKAK1wj408O5eDa6L')
            .update(orderId + '|' + paymentId)
            .digest('hex');
        
        if (generatedSignature !== signature) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid payment signature' 
            });
        }
        
        console.log('Payment verified successfully:', paymentId);
        
        res.json({ 
            success: true, 
            message: 'Payment verified successfully',
            bookingId: `BOOK_${Date.now()}`
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
        res.json({ 
            success: true, 
            message: 'Razorpay is configured correctly',
            key_id: process.env.RAZORPAY_KEY_ID ? 'Present' : 'Missing'
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message
        });
    }
});

module.exports = router;