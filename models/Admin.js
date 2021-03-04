const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const AdminSchmea = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username tidak boleh kosong']
    },
    password: {
        type: String,
        required: [true, 'Password tidak boleh kosong'],
        minlength: 6,
        select: false
    },
    role: {
        type: String,
        default: 'admin'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

});


// Encrypt password using bcrypt
AdminSchmea.pre('save', async function(next) {
    if(!this.isModified('password')) {
        next();
    }
    
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// sign JWT and return
AdminSchmea.methods.getSignedJwtToken = function() {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })
};

// match user enter password to hashed paswrod in database
AdminSchmea.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};



module.exports = mongoose.model('Admin', AdminSchmea);