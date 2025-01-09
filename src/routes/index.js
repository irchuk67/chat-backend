const express = require('express');
const validateToken  = require('../middleware/validateToken');
const router = express.Router();

router.use('/api', validateToken, require('./api'));

module.exports = router;
