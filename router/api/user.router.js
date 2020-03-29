const root = require('app-root-path');
const router = require('express').Router();
const controller = require(root + '/controllers/users.controller');
const validate = require(root + '/middlewares/validate.middleware');

router.post('/authenticate', [
    validate.userCredential,
    controller.authenticate
]);

router.post('/register', [
    validate.register,
    controller.register
]);

module.exports = router;