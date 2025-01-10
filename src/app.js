const express = require('express');
const cors = require("cors");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
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

const server = app.listen(PORT, (error) => {
    if(!error) {
        console.log(`Server is running on port ${PORT}`)
    } else {
        console.log("Error: ", error)
    }
})
const wss = new WebSocketServer({ server, path: '/chat' })

wss.on('connection', (ws) => {
    console.log('WebSocket connection established');
    ws.send('OK');

    ws.on('error', err => {
        console.log("Error during WS connection :", session)
        console.error(err)
    });

    ws.on('close', (code, reason) => {
        console.log(`Closing WS connection with id ${session}. Code: ${code}, Reason: ${reason} `)
    });

    ws.on('message', function message(message) {
        websocketHandlerService.receiveMessage(message, ws);
    })
})

module.exports = app;
