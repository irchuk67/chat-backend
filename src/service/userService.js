const User = require('../model/User');
const chatService = require('./chatService')
const fs = require('fs');

function findUserByGoogleId(googleId) {
    return User.findOne({googleId: googleId});
}

function saveOrCheckUser(googleId, sessionId) {
    return User.findOne({googleId: googleId})
        .then(user => {
            if(user) {
                user.sessionId = sessionId;
                return user.save();
            }
            let newUser = new User({
                googleId: googleId,
                sessionId: sessionId
            })
            return newUser.save()
                .then(user => {
                    fs.readFile('defaultChats.json', 'utf8', function (err, data) {
                        if (err) throw err;
                        let defaultChats = JSON.parse(data);
                        defaultChats.forEach(chatWithMessages => {
                            chatService.createChatWithMessages(chatWithMessages, user);
                        })
                    });
                    return user;
                });
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