const express = require('express');
const { celebrate, Joi } = require('celebrate');

const moviesRoutes = express.Router();

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
            image: Joi.string().uri().required(),
            trailerLink: Joi.string().uri().required(),
            thumbnail: Joi.string().uri().required(),
            nameRU: Joi.string().required(),
            nameEN: Joi.string().required(),
        }),
    }),
    createMovie,
);

moviesRoutes.delete(
    '/movies/_id',
    celebrate({
        params: Joi.object().keys({
            movieId: Joi.string().alphanum().hex(),
        }),
    }),
    deleteMovie,
);

module.exports = { moviesRoutes };