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
        const movie = await new Movie({
            owner: req.user._id,
            ...req.body,
        }).save();
        return res.send(movie);
    } catch (err) {
        if (err.name === 'ValidationError') {
            return next(new ReqError('Переданы некорректные данные при создании карточки'));
        }
        return next(err);
    }
};

const deleteMovieById = async (req, res, next) => {
    try {
        const { movieId } = req.params;
        const movie = await Movie.findById(movieId);
        const movieUser = movie.owner._id.toString();
        const userId = req.user._id;
        if (!movie) {
            return next(new NotFoundError('Карточка с указанным ID не найдена'));
        }
        if (movieUser === userId) {
            await Movie.findByIdAndDelete(movieId);
        } else {
            return next(new ForbError('Попытка удалить карточку другого пользователя'));
        }
        return res.send({ message: 'Карточка была удалена' });
    } catch (err) {
        if (err.name === 'CastError') {
            return next(new ReqError('Переданы некорректные данные при удалении карточки'));
        }
        return next(err);
    }
};

module.exports = {
    getMovies,
    createMovie,
    deleteMovieById,
};
