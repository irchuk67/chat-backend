const express = require('express');
const cors = require("cors");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const uuid = require('uuid')
const dotenv = require('dotenv');
const { WebSocketServer } = require('ws');
const websocketHandlerService = require('./service/websocketHandlerService');

dotenv.config();
const app = express();
mongoose.connect('mongodb+srv://new_user:YPPTfrlKOZ8Vvpfw@cluster0.b3sev.mongodb.net/?retryWrites=true&w=majority'/*process.env.MONGODB_URI_USERS || 'mongodb://users:users@localhost:27019/users'*/);
const PORT = process.env.PORT || 8080;

app.use(cors({
    origin: '*'
}));
app.use(bodyParser.json());

require('./model/Chat');
app.use(require('./route'));
const server = app.listen(PORT, (error) => {
    if(!error) {
        console.log(`Server is running on port ${PORT}`)
    } else {
        console.log("Error: ", error)
    }
})

const wss = new WebSocketServer({ server, path: '/chat' });

wss.on('connection', (ws) => {
    console.log('WebSocket connection established');
    let session = uuid.v4().toString();
    websocketHandlerService.sessions.set(session, ws);
    ws.send(session);

    ws.on('error', err => {
        console.log("Error during WS connection :", session)
        console.error(err);
        websocketHandlerService.sessions.delete(session);
    });

    ws.on('close', (code, reason) => {
        console.log(`Closing WS connection with id ${session}. Code: ${code}, Reason: ${reason} `);
        websocketHandlerService.sessions.delete(session);
    });

    ws.on('message', function message(message) {
        websocketHandlerService.receiveMessage(message, ws);
    })
});


module.exports = app;
