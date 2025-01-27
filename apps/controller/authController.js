const passport = require('passport')
const { Strategy } = require('passport-google-oauth20')
const generateUniqueId = require("../utils/random")
const { googleConfig } = require('../db/config/configService')
const { userSchema } = require("../db/mongoDb/models/index");
const commonDBOperation = require("../service/dbMasterService")



const googleStrategy = new Strategy(
    {
        clientID: googleConfig.client_id,
        clientSecret: googleConfig.client_secret,
        callbackURL: `${googleConfig.client_redirect}/api/v1/google/callback`,
    },
    async (accessToken, refreshToken, profile, cb) => {
        const { email, name, picture } = profile._json;
        try {
            const isUser = await commonDBOperation.checkExists(userSchema, "email", email);
            if (!isUser) {
                const create = {
                    googleId: profile.id,
                    email: email,
                    userId: generateUniqueId(),
                    name: name,
                    sessionToken: accessToken,
                    profilePicture: picture,
                };

                await commonDBOperation.save(userSchema, create);

                return cb(null, create);
            } else {
                return cb(null, isUser);
            }
        } catch (error) {
            console.error('Error in Google OAuth:', error.message);
            return cb(error, null);
        }
    }
);



passport.use(googleStrategy);

passport.serializeUser((user, done) => {
    done(null, user._id.toString()); 
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await userSchema.findById(id); // Fetch user from database
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});


const getTokens = (req, res) => {
    try {
        console.log('Session data in getTokens:', req.session);
        if (req.session && req.session.tokens) {
            console.log("mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm", ...req.season);

            const { access_token, refresh_token } = req.session;

            return res.status(200).json({
                message: 'Tokens retrieved successfully',
                access_token,
                refresh_token,
            });
        } else {
            return res.status(404).json({ message: 'No tokens found in session' });
        }
    } catch (error) {
        console.error('Error exposing tokens:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getProfile = (req, res, next) => {
    try {
        const user = req.session.user;

        const result = {
            email: user?.email,
            name: user?.name,
            profilePicture: user?.profilePicture,
        };
        return res.success({ data: result });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

const logout = (req, res, next) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                const error = new Error('Session issues');
                error.statusCode = 500; // Optional: Set HTTP status code
                return next(error); // Forward error to error-handling middleware
            }
            res.status(200).json({ message: 'Logged out successfully' });
        });
    } catch (error) {
        next(error); // Forward unexpected errors to error-handling middleware
    }
};

module.exports = {
    passport,
    getProfile,
    getTokens,
    logout
}