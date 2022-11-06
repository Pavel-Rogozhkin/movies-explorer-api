const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { AuthError } = require('../errors/auth-err');
const { ConfError } = require('../errors/conf-err');
const { NotFoundError } = require('../errors/not-found-err');
const { ReqError } = require('../errors/req-err');

require('dotenv').config();

const {
    NODE_ENV,
    JWT_SECRET,
} = process.env;

const getUserInfo = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        return res.send(user);
    } catch (err) {
        return next(err);
    }
};

const updateUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(req.user._id, {
            name: req.body.name,
            email: req.body.email,
        }, {
            new: true,
            runValidators: true,
        });
        if (!user) {
            return next(new NotFoundError('Пользователь с указанным ID не найден'));
        }
        return res.send(user);
    } catch (err) {
        if (err.name === 'CastError') {
            return next(new AuthError('Требуется авторизация'));
        }
        if (err.code === 11000) {
            return next(new ConfError('Пользователь с указанным email уже существует'));
        }
        if (err.name === 'ValidationError') {
            return next(new ReqError('Переданы некорректные данные при обновлении профиля'));
        }
        return next(err);
    }
};

const createNewUser = async (req, res, next) => {
    const {
        name,
        email,
        password,
    } = req.body;
    try {
        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            name,
            email,
            password: hashPassword,
        });
        return res.send({ data: newUser });
    } catch (err) {
        if (err.code === 11000) {
            return next(new ConfError('Пользователь с указанным email уже зарегистрирован'));
        }
        if (err.name === 'ValidationError') {
            return next(new ReqError('Переданы некорректные данные при создании пользователя'));
        }
        return next(err);
    }
};

const login = async (req, res, next) => {
    const {
        email,
        password,
    } = req.body;
    try {
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return next(new AuthError('Требуется авторизация'));
        }
        const isValidUser = await bcrypt.compare(password, user.password);
        if (isValidUser) {
            const token = jwt.sign(
                { _id: user._id },
                NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
            );
            res.cookie('jwt', token, {
                expiresIn: '7d',
                httpOnly: true,
                SameSite: {},
                Secure: true,
            });
            return res.send({ data: user.toJSON() });
        }
        return next(new AuthError('Требуется авторизация'));
    } catch (err) {
        return next(err);
    }
};

const signOut = async (req, res, next) => {
    try {
        return await res.clearCookie('jwt').send({ message: 'Выход выполнен, cookies очищены' });
    } catch (err) {
        return next(err);
    }
};

module.exports = {
    getUserInfo,
    updateUser,
    createNewUser,
    login,
    signOut,
};
