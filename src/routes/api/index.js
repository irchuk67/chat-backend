const router = require('express').Router();
const chats = require('./chats');
const users = require('./users');

router.use('/chats', chats);
router.use('/users', users);

module.exports = router;
