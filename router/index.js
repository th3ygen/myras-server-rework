const root = require('app-root-path');
const router = require('express').Router();
const jwt = require(root + '/_helpers/jwt.helper');

// append all tokenless api endpoints
jwt.tokenless.push('/api/billplz/callback');
jwt.tokenless.push('/api/users/login');
jwt.tokenless.push('/api/users/logout');
jwt.tokenless.push('/api/users/register');
jwt.tokenless.push('/api/news/latest');
jwt.tokenless.push('/api/events/');
jwt.tokenless.push('/api/events/getById');
jwt.tokenless.push('/api/events/query');

// secure all API endpoints except the tokenless
router.use('/api', jwt.secure());

router.use('/api', require('./api'));
router.use('/storage', require('./storage'));

module.exports = router;