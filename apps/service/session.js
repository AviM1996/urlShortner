const visitedSession = (req, res, next) => {
    const sessionUser = req.session.user;
    if (!sessionUser) {
        req.session.user = { sessionId: req.session.id };
    }
    next();
};

module.exports = visitedSession;
