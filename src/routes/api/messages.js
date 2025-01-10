const router = require('express').Router({ mergeParams: true });
const messageService = require('../../service/messageService');

router.get('/', (req, res) => {
    console.log('Received request to get all chat messages for chatId: ', req.params.chatId);
    messageService.getAllChatMessages(req.params.chatId)
        .then(messages => {res.json(messages)})
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: err.message })
        })
});

router.put('/:id', (req, res) => {
    console.log('Received request to update message with id: ', req.params.id);
    messageService.updateMessage(req.params.id, req.body)
        .then(message => {
            if(!message) {
                res.status(404).json({ error: 'Not found message with such id' })
                return;
            }
            res.json(message);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: err.message })
        })
});

router.delete('/:id', (req, res) => {
    console.log('Received request to delete message with id: ', req.params.id);
    messageService.deleteMessage(req.params.id)
        .then(message => {
            if(!message) {
                res.status(404).json({ error: 'Not found message with such id' })
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
