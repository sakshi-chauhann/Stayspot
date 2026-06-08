const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// SIMPLIFIED CORS - Accepts requests from any frontend URL
app.use(cors({
    origin: true, // This dynamically accepts any origin
    credentials: true
}));

app.use(express.json());

// Import routes
const paymentRoutes = require('./routes/paymentRoutes');

// Use routes
app.use('/api/payments', paymentRoutes);

// Test route
app.get('/test', (req, res) => {
    res.json({ message: 'Backend is running!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`💳 Payment API: http://localhost:${PORT}/api/payments/test`);
});