const root = require('app-root-path');

const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require(root + '/config');

function user(username, password) {
    return passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err) {
            return res.status(500).json({ err });
        }

        if (user) {
            user.token = jwt.sign({
                role: user.role
            }, config.jwt.SECRET);

            return res.status(200).json({
                user
            });
        }

        return res.status(401).json(info);
    })(req, res, next);
}

module.exports = {
    user
}