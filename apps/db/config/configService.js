require('dotenv').config();

let JWT = {
    secret: process.env.JWT_ACCESS_TOKEN_SECRET,
    options: { expiresIn: 60 * 60 * 2 },

    refresh: process.env.JWT_REFRESH_TOKEN_SECRET,
    options: { expiresIn: 60 * 60 * 3 },
};

let baseUrl = process.env.APP_URL ?? "http://127.0.0.1:8080";
let port = process.env.SERVER_PORT;
let appName = process.env.APP_NAME;
let dbType = process.env.DB_TYPE


let mongoConfig = {
    dbUrl: process.env.MONGODB_URL,
    debug: process.env.MONGODB_DEBUG === 'true'
}

let googleConfig = {
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    client_redirect: process.env.CLIENT_REDIRECT
}

let rateLimit = {
    rate_limit_max: parseInt(process.env.RATE_LIMIT_MAX),
    rate_limit_windows_ms: parseInt(process.env.RATE_LIMIT_WINDOW_MS)
}

let redis = {
    host: process.env.REDIS_URL_HOST,
    port: process.env.REDIS_URL_PORT
}

module.exports = {
    baseUrl,
    port,
    appName,
    mongoConfig,
    JWT,
    googleConfig,
    rateLimit,
    redis,
    dbType 
}
