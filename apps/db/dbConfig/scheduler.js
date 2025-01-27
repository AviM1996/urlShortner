const schedule = require("node-schedule");
const { checkDatabaseHealth, measureResponseTime } = require("./healthCheck");
const mongoStrategy = require("../mongoDb/database-service/mongoHealthStrategy");

function scheduleHealthMonitoring() {
    console.log("Setting up health monitoring scheduler.");
    schedule.scheduleJob("*/1 * * * *", async () => {
        console.log("Health monitoring job triggered at", new Date());
        try {
            const health = await checkDatabaseHealth(mongoStrategy);
            const responseTime = await measureResponseTime(mongoStrategy);
            console.log(`Database Health: ${health}`);
            console.log(`Database Response Time: ${responseTime}`);
        } catch (error) {
            console.error("Error during scheduled health monitoring:", error);
        } finally {
            console.log("Health monitoring job completed at", new Date());
        }
    });
}

module.exports = {
    scheduleHealthMonitoring,
};
