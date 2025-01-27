const { checkDatabaseHealth, measureResponseTime } = require("./healthCheck");
const mongoStrategy = require("../mongoDb/database-service/mongoHealthStrategy");
const { connectToDatabase } = require("../mongoDb/server");
const configService = require("../config/configService")

async function initializeDatabase() {
    try {
        let strategy;

        if (configService.dbType === "mongodb") {
            await connectToDatabase();
            strategy = mongoStrategy;
        } else {
            throw new Error(`Unsupported database type: ${dbType}`);
        }

        // Check health and response time
        // const health = await checkDatabaseHealth(strategy);
        // const responseTime = await measureResponseTime(strategy);

        // console.log(`Database Type: ${configService.dbType}`);
        // console.log(`Database Health: ${health}`);
        // console.log(`Database Response Time: ${responseTime}`);
    } catch (error) {
        console.error("Error initializing the server:", error);
    }
}

module.exports = {
    initializeDatabase
}