const express = require('express');
const { celebrate, Joi } = require('celebrate');
const { getUserInfo, updateUser } = require('../controllers/users');

const usersRoutes = express.Router();

usersRoutes.get('/users/me', getUserInfo);

usersRoutes.patch(
    '/users/me',
    celebrate({
        body: Joi.object().keys({
            name: Joi.string().min(2).max(30).required(),
            email: Joi.string().email().required(),
        }),
    }),
    updateUser,
);

module.exports = { usersRoutes };
