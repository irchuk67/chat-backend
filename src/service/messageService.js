const Message = require('../model/Message');

const MessageType = {
    SEND : 'SEND',
    RECEIVED : 'RECEIVED'
}

function getLatestChatMessage(chatId) {
    return Message.findOne({ chatId: chatId }).sort({ date: -1 })
}

function createNewMessage(message) {
    let newMessage = new Message({
        content: message.content,
        chatId: new mongoose.Types.ObjectId(message.chatId),
        messageType: message.messageType,
        date: new Date()
    });

    return newMessage.save();
}

function deleteMessage(id) {
    return Message.findByIdAndDelete(id)
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

function getAllChatMessages(chatId) {
    return Message.find({ chatId: chatId })
}

module.exports = {
    getLatestChatMessage,
    createNewMessage,
    MessageType,
    getAllChatMessages,
    deleteMessage,
    updateMessage
};
