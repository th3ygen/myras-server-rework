const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const content = new Schema({
    section: String,

    content: [{
        section: String,
        data: [{
            label: String,
            value: String
        }]
    }]
});

mongoose.model('Content', content);