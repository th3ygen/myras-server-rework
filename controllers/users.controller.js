const root = require('app-root-path');
const mongoose = require('mongoose');
const passport = require('passport');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require(root + '/config');

const User = mongoose.model('User');

function authenticate(req, res, next) {
    req.body = req.body.user;
    return passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err) {
            return res.status(500).json({ err });
        }

        if (user) {
            const token = jwt.sign({
                role: user.role
            }, config.jwt.SECRET);

            return res.status(200).json({
                user,
                token
            });
        }

        return res.status(401).json(info);
    })(req, res, next);
}

async function register(req, res, next) {
    const user = new User(req.body.user);

    user.hash = bcrypt.hashSync(req.body.user.password, 7);

    user.role = 'user';
    
    user.member.id = 'MYRAS00000';
    user.member.status = 'Inactive';

    await user.save();

    return res.json({ user }).status(200);
}

function edit(req, res, next) {
    const { body: { id, newDoc } } = req;
    return User.findByIdAndUpdate(id, newDoc, (err, result) => {
        if (err) {
            return res.json({ message: 'error updating user: ' + err }).status(400);
        }

        return res.json({ result }).status(200);
    });
}

function getAll(req, res, next) {
    return User.find({}, (err, result) => {
        if (err) {
            return res.json({ message: 'error getting users: ' + err }).status(500);
        }

        return res.json({ result }).status(200);
    });
}

function remove(req, res, next) {
    const { body: { id } } = req;
    return User.findByIdAndDelete(id, (err, result) => {
        if (err) {
            return res.json({ message: 'error deleting users: ' + err }).status(500);
        }

        return res.json({ message: `user ${result.username} deleted` }).status(200);
    })
}

module.exports = {
    authenticate,
    register
}