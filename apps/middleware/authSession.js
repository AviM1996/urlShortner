const isSession = (req, res, next) => {
    if (req.session && req.session.user) { 
        next(); 
    } else {
        res.status(401).send("Unauthorized"); 
    }
};

const isMaintainer = (req, res, next) => {
    try {
        const isMaintenances = process.env.IS_MAINTENANCES;
        if (isMaintenances === 'true') {
            throw new Error('server maintenances', 10000); // TODO: 10000 server maintenances
        }
        next();
    } catch (err) {
        console.warn(err);
        next(err);
    }
};

module.exports = {
    isSession,
    isMaintainer,
};
