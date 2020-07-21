const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    title: String,
    description: String,
    imgURL: String,
    cluster: String,
    tags: [String],

    content: String,

    author: String,

    views: Number,
    datePublish: Number
});

mongoose.model('News', schema);