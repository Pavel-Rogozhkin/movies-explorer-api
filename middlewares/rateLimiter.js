const rateLimiter = require('express-rate-limit');

module.exports = rateLimiter({
    windowMs: 20 * 60 * 1000,
    max: 100,
});
