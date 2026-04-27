const mongoose = require('mongoose');

const pgSchema = new mongoose.Schema({
    name: { type: String, required: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    description: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    price: { type: Number, required: true },
    location: {
        lat: { type: Number },
        lng: { type: Number }
    },
    facilities: [String],
    images: [String],
    contactNumber: { type: String, required: true },
    type: { type: String, enum: ['boys', 'girls', 'co-ed'], default: 'co-ed' },
    totalRooms: { type: Number },
    availableRooms: { type: Number },
    ratings: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('PG', pgSchema);