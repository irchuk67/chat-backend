const router = require('express').Router();
const chats = require('./chats');
const users = require('./users');
const messages = require('./messages');

router.use('/chats', chats);
router.use('/users', users);
router.use('/chats/:chatId/messages', messages);

module.exports = router;
