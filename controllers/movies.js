const Movie = require('../models/movie');

const { NotFoundError } = require('../errors/not-found-err');
const { ReqError } = require('../errors/req-err');
const { ForbError } = require('../errors/forb-err');

const getMovies = async (req, res, next) => {
    try {
        const movies = await Movie.find({});
        return res.send(movies);
    } catch (err) {
        return next(err);
    }
};

const createMovie = async (req, res, next) => {
    try {
        const movie = await Movie.create({ owner: req.user._id, ...req.body });
        return res.status(201).send(movie);
    } catch (err) {
        if (err.name === 'ValidationError') {
            return next(new ReqError('Переданы некорректные данные при создании фильма'));
        }
        return next(err);
    }
};

const deleteMovieById = async (req, res, next) => {
    try {
        const { movieId } = req.body;
        const movie = await Movie.findById(movieId);
        const movieUser = movie.owner._id.toString();
        const userId = req.user._id;
        if (!movie) {
            return next(new NotFoundError('Фильм с указанным ID не найден'));
        }
        if (movieUser === userId) {
            await Movie.findByIdAndDelete(movieId);
        } else {
            return next(new ForbError('Попытка удалить фильм другого пользователя'));
        }
        return res.send({ message: 'Фильм был удален' });
    } catch (err) {
        if (err.name === 'CastError') {
            return next(new ReqError('Переданы некорректные данные при удалении фильма'));
        }
        return next(err);
    }
};

module.exports = {
    getMovies,
    createMovie,
    deleteMovieById,
};
