const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    googleId: { type: String, required: true },
    sendRandomMessages: { type: String, required: true , default: true},
    sessionId: { type: String, required: true },
});

module.exports = mongoose.model('User', UserSchema)
