require('dotenv').config();

const express = require('express');
const errorhandler = require('errorhandler');
const notifier = require('node-notifier');
const chalk = require('chalk');

const cors = require('cors');
const bodyParser = require('body-parser');

(async (app) => {
    app.use(cors());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    // serve static angular files
    app.use('/', express.static('./public'));

    // contents
    app.use('/content', express.static('./content'));

    let port = 80;
    if (process.env.NODE_ENV === 'development') {
        app.use(errorhandler({ log: (err, str, req) => {
            notifier.notify({
              title: 'Error in ' + req.method + ' ' + req.url,
              message: str
            })
        } }));
        port = 8080
    }

    // mongodb models
    require('./models/users.model');
    require('./models/bill.model');
    require('./models/news.model');
    require('./models/event.model');
    require('./models/content.model');

    // services
    await require('./services/mongoose.service').init();
    
    require('./services/passport.service');

    app.use(require('./router'));

    app.listen(port, () => {
        console.log(chalk.green('[APP]'), `listening to port ${port}`);
    });
})(express());




