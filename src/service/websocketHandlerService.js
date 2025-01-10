const messageService = require('./messageService');
const adviceClient = require('../client/adviceClient');

const sessions = new Map()

function receiveMessage(receivedMessage, ws) {
    let newMessage = JSON.parse(receivedMessage);
    newMessage.messageType = messageService.MessageType.SEND;
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

module.exports = {
    receiveMessage,
    sessions
}
