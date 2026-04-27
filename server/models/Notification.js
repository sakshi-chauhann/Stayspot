const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    icon: { type: String, default: '🔔' },
    type: { type: String, enum: ['booking', 'payment', 'message', 'system'], default: 'system' },
    read: { type: Boolean, default: false },
    link: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);