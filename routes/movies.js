const express = require('express');
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const { getMovies, createMovie, deleteMovieById } = require('../controllers/movies');

const moviesRoutes = express.Router();

const urlValid = (value, helpers) => {
    if (validator.isURL(value)) {
        return value;
    }
    return helpers.message('Неверный формат ссылки');
};

moviesRoutes.get('/movies', getMovies);

moviesRoutes.post(
    '/movies',
    celebrate({
        body: Joi.object().keys({
            country: Joi.string().required(),
            director: Joi.string().required(),
            duration: Joi.number().required(),
            year: Joi.string().required(),
            description: Joi.string().required(),
            image: Joi.string().custom(urlValid).required(),
            trailerLink: Joi.string().custom(urlValid).required(),
            thumbnail: Joi.string().custom(urlValid).required(),
            nameRU: Joi.string().required(),
            nameEN: Joi.string().required(),
            movieId: Joi.string().length(24).alphanum().hex(),
        }),
    }),
    createMovie,
);

moviesRoutes.delete(
    '/movies/_id',
    celebrate({
        body: Joi.object().keys({
            movieId: Joi.string().alphanum().hex(),
        }),
    }),
    deleteMovieById,
);

module.exports = { moviesRoutes };
