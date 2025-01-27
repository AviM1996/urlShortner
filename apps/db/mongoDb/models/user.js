const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    googleId: {
        type: String,
        default: null
    },

    userId: { 
        type: String, 
        unique: true, 
        required: true 
    },

    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },

    password: {
        type: String,
        default: null
    },

    profilePicture: {
        type: String,
        default: ""
    },

    sessionToken: {
        type: String,
    },

    status: {
        type: [Number],
        default: 1,
        enum: [0, 1, 3],
    },

    isDeleted: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true },
);

const User = mongoose.model("users", userSchema);

module.exports = User;
