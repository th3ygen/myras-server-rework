require('dotenv').config();

const express = require('express');
const errorhandler = require('errorhandler');
const notifier = require('node-notifier');
const chalk = require('chalk');

const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

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
require('./models/payments.model');
require('./models/news.model');
require('./models/event.model');

// services
require('./services/mongoose.service');
require('./services/passport.service');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(require('./router'));

// server static angular files
app.use('/', express.static('./public'));

app.listen(port, () => {
    console.log(chalk.green('[APP]'), `listening to port ${port}`);

});