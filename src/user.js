const mongoose = require("mongoose");

const user = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    points: {
        type: Number,
        required: true
    }
});

const User = mongoose.model("User", user);

module.exports = User;