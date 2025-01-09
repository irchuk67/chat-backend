const Message = require('../model/Message');

function getLatestChatMessage(chatId) {
    return Message.findOne({ chatId: chatId }).sort({ date: -1 })
}

module.exports = {
    getLatestChatMessage,
};
