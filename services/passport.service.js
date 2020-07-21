const passport = require('passport');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const LocalStrategy = require('passport-local');

const User = mongoose.model('User');

passport.use(new LocalStrategy( (username, password, done) => {
    User.findOne({ username }).then( user => {
        if (!user || bcrypt.compareSync(user.hash, password)) {
            return done(null, false, { message: 'username or password doesn\'t match ' })
        }
        return done(null, user);
    }).catch(done);
}));