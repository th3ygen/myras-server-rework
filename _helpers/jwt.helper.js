const root = require('app-root-path');

const expressJwt = require('express-jwt');
const { jwt: { SECRET } } = require(root + '/config.js');

let tokenless = [];
function secure() {
    return expressJwt({ secret: SECRET }).unless({
       path: tokenless
    })
};

module.exports = {
    secure,
    path
}
