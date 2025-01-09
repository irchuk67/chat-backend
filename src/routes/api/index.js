const router = require('express').Router();
const chats = require('./chats');

router.use('/chats', chats);

module.exports = router;