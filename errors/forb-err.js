const { forbErr } = require('../constants/consts');

class ForbError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = forbErr;
    }
}

module.exports = { ForbError };
