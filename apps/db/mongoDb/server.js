const mongoose = require("mongoose");
const configService = require("../config/configService")

async function connectToDatabase() {
    try {
        // Enable debug mode if specified in the config
        mongoose.set("debug", configService.mongoConfig.debug === 'true');

        // Connect to MongoDB without deprecated options
        await mongoose.connect(configService.mongoConfig.dbUrl);

        console.log("Connected to MongoDB successfully!");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}


module.exports = {
    connectToDatabase,
};