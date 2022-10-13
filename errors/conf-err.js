const { confErr } = require('../constants/consts');

class ConfError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = confErr;
    }
}

module.exports = { ConfError };
