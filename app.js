const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const console = require('console');
// const cors = require('cors');
const helmet = require('helmet');

const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { errorsHandler } = require('./middlewares/errors');
const { routes } = require('./routes/routes');

require('dotenv').config();

const {
    PORT = 3000,
    MONGO_URI = 'mongodb://localhost:27017/filmsdb',
} = process.env;

const app = express();

app.use(helmet());

app.use(
    bodyParser.urlencoded({
        extended: false,
    }),
);

// app.use(cors({
//     origin: [
//         // 'http://localhost:3000',
//         // 'http://frontendURL',
//         // 'https://localhost:3000',
//         // 'https://frontendURL',
//     ],
//     credentials: true,
// }));

app.use(bodyParser.json());

app.use(cookieParser());

app.use(requestLogger);

app.use(routes);

app.use(errorLogger);

app.use(errors());

app.use(errorsHandler);

async function server() {
    await mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: false,
    });
    await app.listen(PORT, () => {
        console.log(`Server starting on port: ${PORT}`);
    });
}

server();
