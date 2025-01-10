const User = require('../model/User');

function findUserByGoogleId(googleId) {
    return User.findOne({googleId: googleId});
}

function saveOrCheckUser(googleId) {
    return User.findOne({googleId: googleId})
        .then(user => {
            if(user) {
                return user;
            }
            let newUser = new User({
                googleId: googleId,
            })
            return newUser.save();
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
    findUserByGoogleId,
    manageRandomMessages,
    findUsersWithEnabledRandomMessages
}