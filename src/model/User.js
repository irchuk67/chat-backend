const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    googleId: { type: String, required: true },
    sendRandomMessages: { type: String, required: false },
});

module.exports = mongoose.model('User', UserSchema)
