const router = require('express').Router();
const jwt = require(root + '/services/jwt.service');

// append all tokenless api endpoints
jwt.tokenless.push('/api/billplz/callback');
jwt.tokenless.push('/api/users/authenticate');
jwt.tokenless.push('/api/users/register');
jwt.tokenless.push('/api/news');

// secure all endpoints except the tokenless
router.use(jwt.secure());

router.use('/api', require('./api'));
router.use('/storage', require('./storage'));

module.exports = router;