const { RateLimiterMemory } = require("rate-limiter-flexible");
const { rateLimit } = require('../db/config/configService')

const opts = {
    points: rateLimit.rate_limit_max,
    duration: (rateLimit.rate_limit_windows_ms) / 1000, // Per second
};

exports.rateLimiter = new RateLimiterMemory(opts);