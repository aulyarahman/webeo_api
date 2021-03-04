const crypto  = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const text = `Tidak Boleh Kosong <br/>`

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'kosong'],
    },
    role: {
        type: String,
        required: [true, 'kosong' ],
    },
    noKursi: {
        type: String,
        unique: true,
        required: [true, 'kosong'],      
    },
    hasilSwab: {
        type: String,
        required: [true, 'kosong']
    },
    noHandphone: {
        type: String,
        unique: true,
        required: [true, 'kosong'],
        match: [
            /^[0-9\b]+$/,
            "Nomor Tidak Valid"
        ]
    },
    statusKehadiran: {
        type: String,
        required: [true, 'kosong']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Sign JWT
userSchema.methods.getSignedJwtToken = function() {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })
};




module.exports = mongoose.model('User', userSchema);