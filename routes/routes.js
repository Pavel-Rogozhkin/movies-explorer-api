const express = require('express');

const routes = express.Router();

const { celebrate, Joi } = require('celebrate');
const { usersRoutes } = require('./users');
const { moviesRoutes } = require('./movies');
const { auth } = require('../middlewares/auth');
const { NotFoundError } = require('../errors/not-found-err');
const { login, createNewUser } = require('../controllers/users');

routes.use(express.json());

routes.post(
    '/signin',
    celebrate({
        body: Joi.object().keys({
            email: Joi.string().required().email(),
            password: Joi.string().required(),
        }),
    }),
    login,
);

routes.post(
    '/signup',
    celebrate({
        body: Joi.object().keys({
            name: Joi.string().min(2).max(30),
            email: Joi.string().required().email(),
            password: Joi.string().required(),
        }),
    }),
    createNewUser,
);

routes.post('/signout', (req, res) => {
    res.clearCookie('jwt').send({ message: 'Выход выполнен' });
});

routes.use(auth);
routes.use(usersRoutes);
routes.use(moviesRoutes);

routes.use((req, res, next) => {
    try {
        return next(new NotFoundError('Страница не найдена'));
    } catch (err) {
        return next(err);
    }
});

module.exports = { routes };
