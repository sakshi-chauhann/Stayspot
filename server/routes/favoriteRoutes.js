const express = require('express');
const router = express.Router();
const Favorite = require('../models/Favorite');
const auth = require('../middleware/auth');

// Get user's favorites
router.get('/', auth, async (req, res) => {
    try {
        const favorites = await Favorite.find({ userId: req.user.id })
            .populate('pgId')
            .sort({ createdAt: -1 });
        res.json(favorites);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add to favorites
router.post('/', auth, async (req, res) => {
    try {
        const { pgId } = req.body;
        
        const existing = await Favorite.findOne({ userId: req.user.id, pgId });
        if (existing) {
            return res.status(400).json({ message: 'Already in favorites' });
        }
        
        const favorite = new Favorite({
            userId: req.user.id,
            pgId
        });
        
        await favorite.save();
        res.status(201).json(favorite);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Remove from favorites
router.delete('/:pgId', auth, async (req, res) => {
    try {
        await Favorite.findOneAndDelete({ 
            userId: req.user.id, 
            pgId: req.params.pgId 
        });
        res.json({ message: 'Removed from favorites' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;