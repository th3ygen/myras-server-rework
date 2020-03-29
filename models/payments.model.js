const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const payment = new Schema({
    id: {
        type: String,
        required: true
    },

    date: String,
    platform: String,

    description: String,

    amount: Number,
});

mongoose.model('Payment', payment);