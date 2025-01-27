// async function checkDatabaseHealth(strategy) {
//     try {
//         if (!strategy || typeof strategy.healthCheck !== "function") {
//             throw new Error("A valid healthCheck strategy is required.");
//         }
//         const isHealthy = await strategy.healthCheck();
//         return isHealthy ? "Healthy" : "Unhealthy";
//     } catch (error) {
//         console.error("Database health check failed:", error);
//         return "Unhealthy";
//     }
// }

// async function measureResponseTime(strategy) {
//     try {
//         if (!strategy || typeof strategy.ping !== "function") {
//             throw new Error("A valid ping strategy is required.");
//         }
//         const start = Date.now();
//         await strategy.ping();
//         const end = Date.now();
//         return `${end - start}ms`;
//     } catch (error) {
//         console.error("Failed to measure database response time:", error);
//         return "Error";
//     }
// }

// module.exports = {
//     checkDatabaseHealth,
//     measureResponseTime,
// };

