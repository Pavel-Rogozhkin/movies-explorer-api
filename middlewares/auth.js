const jwt = require('jsonwebtoken');
const { AuthError } = require('../errors/auth-err');
require('dotenv').config();

const {
    NODE_ENV,
    JWT_SECRET,
} = process.env;

const auth = async (req, res, next) => {
    // console.log(req);
    let payload;
    const token = req.cookies.jwt;
    try {
        payload = await jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
    } catch (err) {
        return next(new AuthError('Требуется авторизация'));
    }
    req.user = payload;
    return next();
};

module.exports = { auth };
