const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Allow multiple origins (your Vercel frontend + localhost for testing)
const allowedOrigins = [
    'https://stayspot-p.vercel.app',
    'http://localhost:3000',
    'http://localhost:5000'
];

app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
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