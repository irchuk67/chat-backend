const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat',
        required: true
    },
    messageType:  { type: String, required: true },
    content:  { type: String, required: true },
    date: { type: Date, required: true }
});

module.exports = mongoose.model('Message', MessageSchema)
