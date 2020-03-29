const root = require('app-root-path');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: root + '/storage/images',
    filename: function (req, file, cb) {
        cb(null, Date.now().toString() + file.originalname);
    }
});

const upload = multer({ storage });

module.exports = {
    storage,
    upload
}