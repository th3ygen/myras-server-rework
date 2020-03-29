const reqlib = require('app-root-path');
const router = require('express').Router();
const controller = require(root + '/controllers/event.controller');

router.post('/post', [
    controller.post
]);

router.post('/edit', [
    controller.edit
]);

router.post('/get', [
    controller.getAll
]);

router.post('/delete', [
    controller.remove
]);

module.exports = {
    router
}