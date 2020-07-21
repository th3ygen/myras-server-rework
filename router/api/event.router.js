const root = require('app-root-path');
const router = require('express').Router();
const controller = require(root + '/controllers/event.controller');

const multer = require('multer');
const storage = multer.diskStorage({
    destination: `${root}/content/events/`,
    filename: (req, file, cb) => {
        cb(null, `event_${req.body.cluster.toString().replace(' ', '_')}_${req.body.organizer.toString().replace(' ', '_')}_${Date.now()}`);
    }
})
const upload = multer({ storage });

router.get('/', [
    controller.getAll
]);

router.get('/get', [
    controller.get
]);

router.post('/getById', [
    controller.getById
]);

router.get('/total', [
    controller.getTotalEvents
]);

router.get('/query', [
    controller.query
]);

router.post('/publish', upload.fields([{ name: 'content', maxCount: 1 }, { name: 'img', maxCount: 1 },]), [
    controller.publish
]);

router.post('/stats/inc', [
    controller.statIncrement
]);

router.post('/hide', [
    controller.hide
]);

router.post('/edit', upload.fields([{ name: 'content', maxCount: 1 }, { name: 'img', maxCount: 1 },]), [
    controller.edit
]);

router.get('/delete', [
    controller.delete
]);

module.exports = router;