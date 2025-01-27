const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis').default;
const { redisConnect } = require('./redisConfig');


const apiLimit = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    store: new RedisStore({
        sendCommand: (...args) => redisConnect.call(...args),
    }),
    handler(req, res) {
        try {
            return res.toManyRequest({ data: 'Too many requests', message: "Try again after 5 minutes" })
        } catch (error) {
            return res.internalServerError({ message: 'An unexpected error occurred while handling the rate limit.' });
        }
    }
});

module.exports = { apiLimit };
