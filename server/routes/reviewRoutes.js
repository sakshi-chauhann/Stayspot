const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const PG = require('../models/PG');
const auth = require('../middleware/auth');

// Get reviews for a PG
router.get('/pg/:pgId', async (req, res) => {
    try {
        const reviews = await Review.find({ pgId: req.params.pgId })
            .populate('userId', 'name profilePhoto')
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add review
router.post('/', auth, async (req, res) => {
    try {
        const { pgId, rating, comment } = req.body;
        
        // Check if user already reviewed
        const existingReview = await Review.findOne({ pgId, userId: req.user.id });
        if (existingReview) {
            return res.status(400).json({ message: 'You have already reviewed this PG' });
        }
        
        const review = new Review({
            pgId,
            userId: req.user.id,
            rating,
            comment
        });
        
        await review.save();
        
        // Update PG ratings
        const reviews = await Review.find({ pgId });
        const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        
        await PG.findByIdAndUpdate(pgId, {
            ratings: avgRating,
            totalReviews: reviews.length
        });
        
        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;