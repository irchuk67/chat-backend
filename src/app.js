const express = require('express');
const cors = require("cors");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

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

module.exports = app;
