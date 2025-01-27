const mongoose = require("mongoose");

const mongoStrategy = {
    healthCheck: async () => {
        try {
            const admin = mongoose.connection.db.admin();
            const pingResult = await admin.ping();
            return pingResult.ok === 1;
        } catch (error) {
            console.error("MongoDB health check failed:", error);
            return false;
        }
    },
    ping: async () => {
        try {
            await mongoose.connection.db.command({ ping: 1 });
        } catch (error) {
            console.error("MongoDB ping failed:", error);
            throw error;
        }
    },
};

module.exports = mongoStrategy;
