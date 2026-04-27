const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    age: { type: Number, required: true },
    role: { type: String, enum: ['student', 'owner'], required: true },
    profilePhoto: { type: String, default: '' },
    // Student specific
    course: { type: String },
    year: { type: String },
    location: { type: String },
    // Owner specific
    businessName: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);