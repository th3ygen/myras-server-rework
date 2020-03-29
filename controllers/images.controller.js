function upload(req, res, next) {
    const { file } = req;

    if (!file) {
        const err = new Error('No file uploaded');
        err.httpStatusCode = 400;
        return next(err);
    }

    delete file.destination;
    file.path = `/storage/images/${file.filename}`;

    res.json({ message: `file uploaded`, file });
}

function uploadMultiple(req, res, next) {
    const { files } = req;

    if (!files) {
        const err = new Error('no file');
        err.httpStatusCode = 400;
        return next(err);
    }

    files.forEach(file => {
        delete file.destination;
        file.path = `/storage/images/${file.filename}`;
    });

    res.json({ message: 'files uploaded', files }).status(200);
}

module.exports = {
    upload,
    uploadMultiple
}