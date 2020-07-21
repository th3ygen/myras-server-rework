const mongoose = require('mongoose');
const chalk = require('chalk');

async function init() {
    mongoose.Promise = global.Promise;

    // Connect MongoDB at default port 27017.
    await mongoose.connect('mongodb://localhost:27017/demo-myras', {
        autoIndex: false,
        poolSize: 10,
        bufferMaxEntries: 0,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    }, (err) => {
        if (!err) {
            console.log(chalk.green('[Mongoose]'), 'MongoDB Connection Succeeded.')
        } else {
            console.log(chalk.red('[Mongoose]'), 'Error in DB connection: ' + err)
        }
    });
    
}

module.exports = {
    init
};
