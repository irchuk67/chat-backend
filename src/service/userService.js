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

module.exports = {
    saveOrCheckUser,
    findUserByGoogleId
}