const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    username: String,
    email: String,

    hash: String,

    role: String,

    member: {
        id: {
            type: String,
        },
        type: {
            type: String
        },
        status:{
            type: String
        },
        enabled: {
            type: Boolean
        },
        num: {
            type: Number
        },
        lifetime: Boolean,
        plan: String
    },

    bills: [String],

    details: {
        title: String,

        fullname: String,
        ic: String,
        nationality: String,
        dob: String,
        phoneNum: String,

        address: {
            lines: [String],
            city: String,
            state: String,
            zip: String,
            country: String
        },

        contacts: [String],

        sectors: [String],
        cluster: String,

        company: {
            name: String,
            businessNature: String,
            jobTitle: String,
            address: {
                line: String,
                city: String,
                state: String,
                zip: String,
                country: String,
            },
            officePhoneNum: String
        },

        student: {
            stdId: String,
            university: String,
            course: String,
            address: {
                line: String,
                city: String,
                state: String,
                zip: String,
                country: String,
            },
        },

        regular: {
            organization: String,
            occupation: String,
            webUrl: String,
        },

        corp: {
            companyName: String,
            business: String,
            phoneNum: String,

            represent: {
                fullname: String,
                jobTitle: String,
                phoneNum: String
            }
        },
    },

    lastOnline: Number,
    dateCreated: Number,
});

mongoose.model('User', schema);
