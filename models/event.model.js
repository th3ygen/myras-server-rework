const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema({
    title: String,
    description: String,
    imgPath: String,
    cluster: String,
    keywords: String,
    // video, category, 
    contentPath: String,

    organizer: String,

    startDate: Number,
    endDate: Number,

    views: Number,
    datePublish: Number,
    dateEdit: Number,

    visible: Boolean
});

mongoose.model('Event', schema);