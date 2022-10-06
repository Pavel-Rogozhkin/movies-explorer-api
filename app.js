const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const console = require('console');
const cors = require('cors');
const { celebrate, Joi, errors } = require('celebrate');
const { createNewUser, login } = require('./controllers/users');
const { auth } = require('./middlewares/auth');
const { NotFoundError } = require('./errors/not-found-err');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { errorsHandler } = require('./middlewares/errors');

require('dotenv').config();

const {
    PORT = 3000,
    MONGO_URI = 'mongodb://localhost:27017/bitfilmsdb',
} = process.env;