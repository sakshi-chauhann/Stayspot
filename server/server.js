const express = require('express');

const cors = require('cors');

const dotenv = require('dotenv');

const connectDB = require('./config/db');





dotenv.config();

connectDB();



const app = express();



app.use(cors());

app.use(express.json());



app.get('/', (req, res) => {

    res.json({ 

        message: 'Welcome to StaySpot API!',

        version: '1.0.0',

        status: 'Server is running',

        endpoints: {

            auth: '/api/auth',

            pg: '/api/pg',

            bookings: '/api/bookings',

            reviews: '/api/reviews'

        }

    });

});

app.use(express.urlencoded({ extended: true }));



app.use('/api/auth', require('./routes/authRoutes'));

app.use('/api/pg', require('./routes/pgRoutes'));

app.use('/api/bookings', require('./routes/bookingRoutes'));

app.use('/api/reviews', require('./routes/reviewRoutes'));

app.use('/api/favorites', require('./routes/favoriteRoutes'));



app.use((err, req, res, next) => {

    console.error(err.stack);

    res.status(500).json({ message: 'Something went wrong!' });

});



app.use('/api/notifications', require('./routes/notificationRoutes'));

const PORT = process.env.PORT || 5000;



app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);

    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);

});