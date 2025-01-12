const messageService = require('./messageService');
const adviceClient = require('../client/adviceClient');
const userService = require('./userService');
const chatService = require('./chatService');
const cron = require('node-cron')

const sessions = new Map()

function receiveMessage(receivedMessage, ws) {
    let parsed = JSON.parse(receivedMessage);
    if(parsed.type === 'NEW_MESSAGE') {
        let newMessage = parsed.message;
        newMessage.messageType = messageService.MessageType.SENT;
        newMessage.isRead = true;
        messageService.createNewMessage(newMessage)
            .then(message => {
                setTimeout(async () => {
                    let chat = await chatService.getChatById(newMessage.chatId.toString());
                    await generateAndSendMessage(chat, ws)
                }, 3000);
            })
            .catch(err => {
                console.error(err);
                ws.send(err.message);
            });
    } else if (parsed.type === 'SET_AS_READ') {
        let readMessages = parsed.messages;
        messageService.markMessagesRead(readMessages);
    }

}

async function generateAndSendMessage(chat, ws) {
    let advice = await adviceClient.getAdvice();
    let generatedMessage = await messageService.createNewMessage({
        chatId: chat._id,
        firstName: chat.firstName,
        lastName: chat.lastName,
        content: advice.slip.advice,
        messageType: messageService.MessageType.RECEIVED,
        isRead: false
    });
    let messageToSend = {
        chatId: generatedMessage.chatId,
        firstName: chat.firstName,
        lastName: chat.lastName,
        content: generatedMessage.content,
        messageType: generatedMessage.messageType,
        date: generatedMessage.date,
        isRead: false
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
        if(ws){
            generateAndSendMessage(chats[index], ws);
        }
    })
});

module.exports = {
    receiveMessage,
    sessions
}
