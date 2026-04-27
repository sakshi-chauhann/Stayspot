const express = require('express');
const router = express.Router();
const PG = require('../models/PG');
const auth = require('../middleware/auth');

// Get all PGs with filters
router.get('/', async (req, res) => {
    try {
        const { city, minPrice, maxPrice, type, facilities } = req.query;
        
        let filter = {};
        if (city) filter.city = city;
        if (type) filter.type = type;
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = parseInt(minPrice);
            if (maxPrice) filter.price.$lte = parseInt(maxPrice);
        }
        
        const pgs = await PG.find(filter).populate('ownerId', 'name phone');
        res.json(pgs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single PG
router.get('/:id', async (req, res) => {
    try {
        const pg = await PG.findById(req.params.id).populate('ownerId', 'name phone');
        if (!pg) return res.status(404).json({ message: 'PG not found' });
        res.json(pg);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create PG (Owner only)
router.post('/', auth, async (req, res) => {
    try {
        if (req.user.role !== 'owner') {
            return res.status(403).json({ message: 'Only owners can create listings' });
        }
        
        const pg = new PG({
            ...req.body,
            ownerId: req.user.id
        });
        
        await pg.save();
        res.status(201).json(pg);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update PG
router.put('/:id', auth, async (req, res) => {
    try {
        const pg = await PG.findById(req.params.id);
        if (!pg) return res.status(404).json({ message: 'PG not found' });
        
        if (pg.ownerId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }
        
        const updatedPG = await PG.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedPG);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete PG
router.delete('/:id', auth, async (req, res) => {
    try {
        const pg = await PG.findById(req.params.id);
        if (!pg) return res.status(404).json({ message: 'PG not found' });
        
        if (pg.ownerId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }
        
        await pg.deleteOne();
        res.json({ message: 'PG deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;