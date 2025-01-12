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

async function getAllChatsForUser(user, search) {
    const regex = new RegExp(search, 'i');
    let chats = await Chat.find({
        $and: [
            { userId: user._id },
            {
                $or: [
                    { firstName: regex },
                    { lastName: regex }
                ]
            }
        ]
    });
    chats = await Promise.all(chats.map(async chat => {
        let unreadMessagesCount = await messageService.countUnreadMessagesForChat(chat._id);
        let mapped = {
            id: chat._id,
            firstName: chat.firstName,
            lastName: chat.lastName,
            userId: chat.userId,
            unreadMessagesCount: unreadMessagesCount
        };
        let latestMessage = await messageService.getLatestChatMessage(chat._id);
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
    return Chat.findById({_id: id});
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

async function createChatWithMessages(chatWithMessages, user) {
    let chatId = await createChat(chatWithMessages, user)
    await chatWithMessages.messages.map(async message => {
        message.chatId = chatId.toString()
        await messageService.createNewMessage(message)
    })
    return chatId
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
