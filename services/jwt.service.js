const root = require('app-root-path');

const expressJwt = require('express-jwt');
const { jwt: { SECRET } } = require(root + '/config.js');

module.exports = jwt;

function jwt() {
    return expressJwt({ secret: SECRET }).unless({
       path: [
        '/api/users/authenticate',
        '/api/users/register',

        '/news'
       ]
    })
};