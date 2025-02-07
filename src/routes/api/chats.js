const router = require('express').Router();
const chatService = require('../../service/chatService');
const userService = require('../../service/userService')

router.get('/', async (req, res) => {
    console.log('Received request to get all chats');
    let user = await userService.findUserByGoogleId(req.userId);
    chatService.getAllChatsForUser(user, req.query.search)
        .then(chats => {res.json(chats)})
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: err.message })
        })
});

router.post('/', async (req, res) => {
    console.log('Received request to create new chat');

    let user = await userService.findUserByGoogleId(req.userId);
    chatService.createChat(req.body, user)
        .then(chatId => {res.status(201).json({id: chatId})})
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: err.message })
        })
});

router.get('/:id', (req, res) => {
    console.log('Received request to get chat with id: ', req.params.id);
    chatService.getChatById(req.params.id)
        .then(chat => {
            if(!chat) {
                res.status(404).json({ error: 'Not found Chat with such id' })
                return;
            }
            res.json(chat);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: err.message })
        })
});

router.put('/:id', (req, res) => {
    console.log('Received request to update chat with id: ', req.params.id);
    chatService.updateChat(req.params.id, req.body)
        .then(chat => {
            if(!chat) {
                res.status(404).json({ error: 'Not found Chat with such id' })
                return;
            }
            res.json(chat);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: err.message })
        })
});

router.delete('/:id', (req, res) => {
    console.log('Received request to delete chat with id: ', req.params.id);
    chatService.deleteChat(req.params.id)
        .then(chat => {
            if(!chat) {
                res.status(404).json({ error: 'Not found Chat with such id' })
                return;
            }
            res.status(204).end();
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: err.message })
        })
});

module.exports = router;
