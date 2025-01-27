const mongoose = require("mongoose");

const UrlLogsSchema = new mongoose.Schema({
    logId: {
        type: String,
        required: true,
        unique: true,
    },
    sessionId: {
        type: String,
        required: true,
    },

    userId: {
        type: String,
    },

    urlId: {
        type:String,
    },

    geoIp: {
        type: String,
    },

    os: {
        type: String,
    },

    browser: {
        type: String,

    },

    platform: {
        type: String,
    },

    browserVersion: {
        type: String,
    },

    source: {
        type: String
    }
}, { timestamps: true }
)
const urlLogs = mongoose.model("urllogs", UrlLogsSchema);

module.exports = urlLogs;