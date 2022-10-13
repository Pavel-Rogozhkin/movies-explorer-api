const { notFoundErr } = require('../constants/consts');

class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = notFoundErr;
    }
}

module.exports = { NotFoundError };
