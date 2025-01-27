const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
    userID: {
        type: String,
    },
    uniqueUrlID: {
        type: String,
    },
    longUrl: {
        type: String,
        required: true
    },
    alias: {
        type: String
    },
    topic: {
        type: String,
        default: null
    },
    isCustomAlias: {
        type: Boolean,
        default: false
    },
    shortUrl: { type: String, required: true, unique: true },
}, { timestamps: true });


const url = mongoose.model("url", urlSchema);

module.exports = url;
