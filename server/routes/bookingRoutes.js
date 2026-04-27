const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const PG = require('../models/PG');
const auth = require('../middleware/auth');

// Create booking
router.post('/', auth, async (req, res) => {
    try {
        if (req.user.role !== 'student') {
            return res.status(403).json({ message: 'Only students can book' });
        }
        
        const { pgId, checkInDate, checkOutDate, totalAmount } = req.body;
        
        // Check if PG exists
        const pg = await PG.findById(pgId);
        if (!pg) {
            return res.status(404).json({ message: 'PG not found' });
        }
        
        // Check availability
        if (pg.availableRooms <= 0) {
            return res.status(400).json({ message: 'No rooms available' });
        }
        
        const booking = new Booking({
            pgId,
            studentId: req.user.id,
            checkInDate,
            checkOutDate,
            totalAmount
        });
        
        await booking.save();
        
        // Reduce available rooms
        pg.availableRooms -= 1;
        await pg.save();
        
        res.status(201).json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get user's bookings
router.get('/my-bookings', auth, async (req, res) => {
    try {
        let bookings;
        if (req.user.role === 'student') {
            bookings = await Booking.find({ studentId: req.user.id })
                .populate('pgId')
                .sort({ createdAt: -1 });
        } else {
            // Owner: get bookings for their PGs
            const pgs = await PG.find({ ownerId: req.user.id });
            const pgIds = pgs.map(pg => pg._id);
            bookings = await Booking.find({ pgId: { $in: pgIds } })
                .populate('pgId')
                .populate('studentId', 'name email phone')
                .sort({ createdAt: -1 });
        }
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update booking status
router.put('/:id/status', auth, async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await Booking.findById(req.params.id).populate('pgId');
        
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        
        // Check authorization
        if (req.user.role === 'owner' && booking.pgId.ownerId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        
        booking.status = status;
        await booking.save();
        
        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;