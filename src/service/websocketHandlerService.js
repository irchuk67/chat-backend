const messageService = require('./messageService');
const adviceClient = require('../client/adviceClient');
const userService = require('./userService');
const chatService = require('./chatService');
const cron = require('node-cron')

const sessions = new Map()

function receiveMessage(receivedMessage, ws) {
    let newMessage = JSON.parse(receivedMessage);
    newMessage.messageType = messageService.MessageType.SENT;
    messageService.createNewMessage(newMessage)
        .then(message => {
            setTimeout(async () => await generateAndSendMessage(message.chatId, ws), 3000);
        })
        .catch(err => {
            console.error(err);
            ws.send(err.message);
        });
}

async function generateAndSendMessage(chatId, ws) {
    let advice = await adviceClient.getAdvice();
    let generatedMessage = await messageService.createNewMessage({
        chatId: chatId,
        content: advice.slip.advice,
        messageType: messageService.MessageType.RECEIVED
    });
    let messageToSend = {
        chatId: generatedMessage.chatId,
        content: generatedMessage.content,
        messageType: generatedMessage.messageType,
        date: generatedMessage.date
    }
    ws.send(JSON.stringify(messageToSend));
}

cron.schedule('*/10 * * * * *', async () => {
    console.log('Looking for users to send messages')
    let users = await userService.findUsersWithEnabledRandomMessages()
    if(!users) {
        return;
    }
    console.log(`Sending random messages to ${users.length} users`);
    users.forEach(async user => {
        let chats = await chatService.findChatsForUser(user._id);
        if(!chats) {
            return;
        }
        if(chats.length === 0) {
            return;
        }
        let index = Math.floor(Math.random() * chats.length);
        let ws = sessions.get(user.sessionId);
        generateAndSendMessage(chats[index]._id, ws);
    })
});

module.exports = {
    receiveMessage,
    sessions
}
