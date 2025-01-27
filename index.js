const express = require('express');
const app = express();
const path = require('path');
const MongoStore = require('connect-mongo');
const useragent = require('express-useragent')
const session = require('express-session');
const userAgentParser = require('express-useragent');
const { initializeDatabase } = require('./apps/db/dbConfig/index'); 
const apiRouter = require('./apps/router/index');
const { passport } = require('./apps/controller/authController');



const sessionMiddleware = session({
    secret: 'your-strong-secret-key',
    resave: false,                 
    saveUninitialized: false,        
    store: MongoStore.create({ mongoUrl: 'mongodb://localhost:27017/session-db' }),
    cookie: {
        httpOnly: true,             
        secure: false,               
        maxAge: 7 * 24 * 60 * 60 * 1000, 
        sameSite: 'lax',             
    },
});
// Set up view engine and views directory
app.set('views', path.join(__dirname, 'apps/views'));
app.set('view engine', 'ejs');

// Middleware for parsing request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(useragent.express());
app.use(userAgentParser.express());


// Custom response handler middleware
app.use(require('./apps/response/responseHandler'));

// Session middleware
app.use(sessionMiddleware);

// Passport initialization and session handling
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
    const user = req.session?.user || null;
    res.render('login', { user });
});

// Mount the main router
app.use('/', apiRouter);

// Function to start the application
async function startApplication() {
    try {
        // Initialize the database
        await initializeDatabase();

        // Start the server
        const PORT = process.env.SERVER_PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}.`);
            console.log(`Follow link: http://localhost:${PORT}/`);
        });
    } catch (error) {
        console.error('Error starting the application:', error);
        process.exit(1);
    }
}

// Start the application
startApplication();
