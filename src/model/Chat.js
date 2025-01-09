const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true }
});

module.exports = mongoose.model('Chat', ChatSchema)
