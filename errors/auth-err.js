const { authErr } = require('../constants/consts');

class AuthError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = authErr;
    }
}

module.exports = { AuthError };
