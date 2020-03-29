const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema({
    title: String,
    description: String,
    cluster: String,
    imgURL: String,

    content: String,

    startDate: Number,
    endDate: Number,

    organizer: String,
    views: Number
});

mongoose.model('Event', schema);