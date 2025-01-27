const session = require('express-session');
const FileStore = require('session-file-store')(session);

const sessionMiddleware = session({
    store: new FileStore(),
    secret: 'your-strong-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: 'lax',
    },
});

module.exports = sessionMiddleware;
