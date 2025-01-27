const JWT = require("../db/config/configService").JWT
const jwt = require('jsonwebtoken');


function signInAccessToken(payload) {
    return jwt.sign(payload, JWT.secret, JWT.options)
}

function signInRefreshToken(payload) {
    return jwt.sign(payload, JWT.refresh, JWT.options)
}

function generateToken(payload) {
    const accessToken = signInAccessToken(payload);
    const refreshToken = signInRefreshToken(payload);
    return { accessToken, refreshToken };
}

module.exports = {
    generateToken,
};