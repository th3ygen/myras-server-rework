const mongoose = require('mongoose');
const Event = mongoose.model('Event');

/* title: String,
    description: String,
    cluster: String,
    imgURL: String,

    content: String,

    startDate: Number,
    endDate: Number,

    organizer: String, */

function post(req, res, next) {
    const { body: { 
        title,
        description,
        cluster,
        imgURL,
        content,
        startDate,
        endDate,
        organizer
    } } = req;

    const event = new Event({
        title,
        description,
        cluster,
        imgURL,
        content,
        startDate,
        endDate,
        organizer
    });

    return event.save().then(() => {
        res.json({ event }).status(200);
    }).catch(err => {
        res.json({ message: 'error in saving data: ' + err }).status(500);
    });
}

function view(req, res, next) {
    const { body: { id } } = req;
    return Event.findByIdAndUpdate(id, { $inc: { views: 1 } }, (err, result) => {
        if (err) {
            return res.json({ message: 'error incrementing views count: ' + err });
        }

        return res.json({ result }).status(200);
    });
}

function edit(req, res, next) {
    const { body: { id, newDoc } } = req;
    return Event.findByIdAndUpdate(id, newDoc, (err, result) => {
        if (err) {
            return res.json({ message: 'error updating event: ' + err }).status(400);
        }

        return res.json(result).status(200);
    });
}

function getAll(req, res, next) {
    return Event.find({}, (err, result) => {
        if (err) {
            return res.json({ message: 'error retrieving events: ' + err }).status(500);
        }

        return res.json({ result }).status(200);
    });
}

function remove(req, res, next) {
    const { params: { id } } = req;
    return Event.findByIdAndDelete(id, (err, result) => {
        if (err) {
            return res.json({ message: 'error deleting event: ' + err }).status(500);
        }

        return res.json({ message: `event with id(${id} sucessfully deleted)` }).status(200);
    });
}

module.exports = {
    post,
    edit,
    getAll,
    remove
}