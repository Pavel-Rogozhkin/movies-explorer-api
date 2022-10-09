const { reqErr } = require('../constants/consts');

class ReqError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = reqErr;
    }
}

module.exports = { ReqError };
