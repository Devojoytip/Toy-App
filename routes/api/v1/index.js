const express = require('express');

const router = express.Router();

router.use('/toys', require('./toys'));

module.exports = router;