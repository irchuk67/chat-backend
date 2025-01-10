const mongoose = require('mongoose');
const Message = require('../model/Message');

const MessageType = {
    SEND : 'SEND',
    RECEIVED : 'RECEIVED'
}

function getAllChatMessages(chatId) {
    return Message.find({ chatId: chatId })
}

function getLatestChatMessage(chatId) {
    return Message.findOne({ chatId: chatId }).sort({ date: -1 })
}

function createNewMessage(message) {
    let newMessage = new Message({
        content: message.content,
        chatId: new mongoose.Types.ObjectId(message.chatId),
        messageType: message.messageType,
        date: message.date ? message.date : new Date()
    });

    return newMessage.save();
}

function deleteMessage(id) {
    return Message.findByIdAndDelete(id)
}

function deleteChatMessages(chatId) {
    return Message.deleteMany({ chatId: chatId })
}

function updateMessage(id, message) {
    return Message.findById(id)
        .then(foundMessage => {
            if(!foundMessage) {
                return null;
            }
            foundMessage.content = message.content;
            return foundMessage.save();
        })
}

module.exports = {
    getAllChatMessages,
    createNewMessage,
    deleteMessage,
    deleteChatMessages,
    getLatestChatMessage,
    updateMessage,
    MessageType
};
