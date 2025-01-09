const Chat = require('../model/Chat');
const messageService = require('../service/messageService');

async function createChat(chat) {
    let newChat = new Chat({
        firstName: chat.firstName,
        lastName: chat.lastName,
    })
    let createdChat = await newChat.save();
    return createdChat._id;
}

async function getAllChats() {
    let chats = await Chat.find({});
    chats = await Promise.all(chats.map(async chat => {
        let latestMessage = await messageService.getLatestChatMessage(chat._id);
        let mapped = {
            id: chat._id,
            firstName: chat.firstName,
            lastName: chat.lastName,
        };
        if (latestMessage) {
            mapped.latestMessage = {
                id: latestMessage._id,
                content: latestMessage.content,
                date: latestMessage.date,
                messageType: latestMessage.messageType,
            }
        }
        return mapped;
    }));
    if (!chats || chats.length === 0) {
        return [];
    }
    chats.sort((a, b) => new Date(b.date) - new Date(a.date));
    return chats;
}

function getChatById(id) {
    return Chat.findById({id: id});
}

function updateChat(id, chat) {
    return Chat.findByIdAndUpdate(
        id,
        {
            firstName: chat.firstName,
            lastName: chat.lastName,
        },
        {
            new: true
        }
    );
}

function deleteChat(id) {
    return Chat.findById(id)
        .then(chat => {
            if(!chat) {
                return null;
            }
            return Chat.deleteOne(chat);
        });
}

module.exports = {
    createChat,
    getAllChats,
    updateChat,
    deleteChat,
    getChatById,
}
