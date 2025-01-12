const User = require('../model/User');
const chatService = require('./chatService')
const defaultChats = require('../../defaultChats.json')

function findUserByGoogleId(googleId) {
    return User.findOne({googleId: googleId});
}

function saveOrCheckUser(googleId, sessionId) {
    return User.findOne({googleId: googleId})
        .then(async user => {
            if(user) {
                user.sessionId = sessionId;
                return await user.save();
            }
            let newUser = new User({
                googleId: googleId,
                sessionId: sessionId
            })
            let savedUser = await newUser.save();
            await Promise.allSettled(defaultChats.map(async chatWithMessages => {
                return await chatService.createChatWithMessages(chatWithMessages, savedUser);
            }))
            return savedUser;
        })
}

function manageRandomMessages(googleId, sendRandomMessages) {
    return User.findOne({googleId: googleId})
        .then(user => {
            if (!user) {
                return null;
            }
            user.sendRandomMessages = sendRandomMessages;
            return user.save();
        })
}

function findUsersWithEnabledRandomMessages() {
    return User.find({sendRandomMessages: true})
}

module.exports = {
    saveOrCheckUser,
    manageRandomMessages,
    findUsersWithEnabledRandomMessages,
    findUserByGoogleId
}