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

module.exports = {
    getLatestChatMessage,
    createNewMessage,
    MessageType
};
