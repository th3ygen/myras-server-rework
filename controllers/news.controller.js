const mongoose = require('mongoose');
const multer = require('multer');

const News = mongoose.model('News');

// take raw content with base64 encodings,
// filter out base64 and store as file into storage
// generate content with images as file path
function contentNoBase64(raw) {

}

function publish(req, res, next) {
    const { body: { title, description, imgURL, cluster, tags, content, datePublish, author } } = req;

    const news = new News({
        title,
        description,
        imgURL,
        cluster,
        tags,
        content,
        datePublish,
        author
    });

    return news.save().then(() => {
        res.json({
            news
        }).status(200);
    });
}

function view(req, res, next) {
    const { body: { id } } = req;
    return News.findByIdAndUpdate(id, { $inc: { views: 1 } }, (err, result) => {
        if (err) {
            return res.json({ message: 'error incrementing views count: ' + err });
        }

        return res.json({ result }).status(200);
    });
}

function edit(req, res, next) {
    const { body: { id, newDoc } } = req;
    return News.findByIdAndUpdate(id, newDoc, (err, result) => {
        if (err) {
            return res.json({ message: 'error updating news: ' + err }).status(400);
        }

        return res.json(result).status(200);
    });
}

function getAll(req, res, next) {
    return News.find({}, (err, result) => {
        if (err) {
            return res.json({ message: 'error retrieving news: ' + err }).status(500);
        }

        return res.json({ result }).status(200);
    });
}

function remove(req, res, next) {
    const { params: { id } } = req;
    return News.findByIdAndDelete(id, (err, result) => {
        if (err) {
            return res.json({ message: 'error deleting news: ' + err }).status(500);
        }

        return res.json({ message: `news with id(${id} sucessfully deleted)` }).status(200);
    });
}

module.exports = {
    publish,
    view,
    edit,
    getAll,
    remove
};
