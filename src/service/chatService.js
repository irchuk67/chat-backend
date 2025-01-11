const Chat = require('../model/Chat');
const messageService = require('./messageService');

async function createChat(chat, user) {
    let newChat = new Chat({
        firstName: chat.firstName,
        lastName: chat.lastName,
        userId: user._id
    })
    let createdChat = await newChat.save();
    return createdChat._id;
}

function findChatsForUser(userId) {
    return Chat.find({userId: userId});
}

async function getAllChatsForUser(user) {
    let chats = await Chat.find({userId: user._id});
    chats = await Promise.all(chats.map(async chat => {
        let latestMessage = await messageService.getLatestChatMessage(chat._id);
        let mapped = {
            id: chat._id,
            firstName: chat.firstName,
            lastName: chat.lastName,
            userId: chat.userId,
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
    chats.sort((a, b) => {
        if (!a.latestMessage) {
            return -1;
        }
        if (!b.latestMessage) {
            return 1;
        }
        return new Date(b.latestMessage.date) - new Date(a.latestMessage.date)
    });
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
            if (!chat) {
                return null;
            }
            messageService.deleteChatMessages(id);
            return Chat.deleteOne(chat);
        });
}

function createChatWithMessages(chatWithMessages, user) {
    return createChat(chatWithMessages, user)
        .then(chatId => {
            chatWithMessages.messages.forEach(message => {
                message.chatId = chatId.toString()
                messageService.createNewMessage(message)
            })
        });
}

module.exports = {
    createChat,
    getAllChatsForUser,
    updateChat,
    deleteChat,
    getChatById,
    findChatsForUser,
    createChatWithMessages
}
