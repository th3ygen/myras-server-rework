const router = require('express').Router();

router.use('/images', require('./images.router'));

module.exports = router;