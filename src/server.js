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
mongoose.connect(process.env.MONGO_DB_URL);
const PORT = process.env.PORT || 8080;

app.use(cors({
    origin: '*'
}));
app.use(bodyParser.json());

require('./model/Chat');
app.use(require('./routes'));
const server = app.listen(PORT, (error) => {
    if(!error) {
        console.log(`Server is running on port ${PORT}`)
    } else {
        console.log("Error: ", error)
    }
})
app.get('/_ah/health', (req, res) => {
    res.status(200).send('OK');
});

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
