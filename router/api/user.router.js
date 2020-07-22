const root = require('app-root-path');
const router = require('express').Router();
const controller = require(root + '/controllers/users.controller');
const validate = require(root + '/middlewares/validate.middleware');

router.post('/login', [
    validate.userCredential,
    controller.authenticate
]);

router.post('/register', [
    validate.register,
    controller.register
]);

router.get('/getAll', [
    controller.getAll
]);

router.get('/disable', [
    controller.disableUser
]);

router.get('/delete', [
    controller.deleteUser
]);

/* router.get('/:id', [
    controller.get
]); */

router.get('/currentUser/info', [
    controller.userGetUser
]);
router.get('/currentUser/getBills', [
    controller.userGetBills
]);

router.post('/currentUser/updateInfo', [
    controller.updateUserInfo
]);

router.post('/currentUser/updatePW', [
    controller.updateUserPW
]);

module.exports = router;