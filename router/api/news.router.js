const root = require('app-root-path');
const router = require('express').Router();
const controller = require(root + '/controllers/news.controller');

router.post('/publish', [
    controller.publish
]);

router.get('/get', [
    controller.getAll
]);

router.patch('/edit', [
    controller.edit
]);

router.delete('/delete', [
    controller.remove
]);

module.exports = router;