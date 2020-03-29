const router = require('express').Router();

router.use('/users', require('./user.router'));
router.use('/news', require('./news.router'));
router.use('/billplz', require('./billplz.router'));

module.exports = router;