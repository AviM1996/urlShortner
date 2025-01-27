const jwt = require('jsonwebtoken');
const { JWT } = require("../db/config/configService");

function generateNewAccessToken(req,user) {
    const data = {
        _id: user._id,
        googleId: user.googleId,
        name: user.name,
        email: user.email,
        password: user.password,
        profilePicture: user.profilePicture,
        role: user.role,
    };

    const access_token = jwt.sign(data, JWT.secret, JWT.accessOptions);
    const refresh_token = jwt.sign(data, JWT.refresh, JWT.refreshOptions);

    return { access_token, refresh_token };
}

function verifyAccessToken(token) {
    try {
        return jwt.verify(token, JWT.secret);
    } catch (error) {
        throw new Error("Invalid or expired access token");
    }
}

function verifyRefreshToken(token) {
    try {
        return jwt.verify(token, JWT.refresh);
    } catch (error) {
        throw new Error("Invalid or expired refresh token");
    }
}


const guard = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Authorization token is missing" });
    }

    try {
        const decoded = verifyAccessToken(token);
        if (!sessionData) {
            return res.status(401).json({ message: "Session expired. Please log in again." });
        }

        req.user = decoded;



        if (requireRole.length && !requireRole.includes(decoded.role)) {
            return res.status(403).json({ message: "Access forbidden: Insufficient permissions" });
        }

        next();
    } catch (error) {
        return res.status(401).json({ message: error.message });
    }
}


module.exports = {
    generateNewAccessToken,
    verifyAccessToken,
    verifyRefreshToken,
    guard,
};
