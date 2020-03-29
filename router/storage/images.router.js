const root = require('app-root-path');
const router = require('express').Router();
/* const multer = require(root + '/services/multer.service'); */
const multer = require('multer');

const controller = require(root + '/controllers/images.controller');

const storage = multer.diskStorage({
    destination: root + '/storage/images',
    filename: function (req, file, cb) {
        cb(null, Date.now().toString() + file.originalname);
    }
});

const upload = multer({ storage });

router.post('/upload', upload.single('img'), controller.upload);

router.post('/uploadmultiple', upload.array('img'), controller.uploadMultiple);

module.exports = router;