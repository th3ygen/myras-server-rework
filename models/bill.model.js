const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bill = new Schema({
    id: {
        type: String
    },
    collection_id: String,

    paid: Boolean,
    state: String,

    amount: Number,
    paid_amount: Number,

    email: String,
    name: String,
    mobile: String,

    url: String,

    description: String,

    issueDate: String,

    billerRef: Schema.Types.ObjectId
});

mongoose.model('Bill', bill);