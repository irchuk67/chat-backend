const router = require('express').Router();
const userService = require('../../service/userService');

router.post('/', (req, res) => {
    console.log('Received request to check or save user');
    userService.saveOrCheckUser(req.userId)
        .then(user => {
            res.status(200).end();
        }).catch(err => {
        console.error(err);
        res.status(500).json({error: err.message});
    })
});

module.exports = router;
