const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema({
    owner: String
});

mongoose.model('Image', schema);