const mongoose = require("mongoose");

module.exports = mongoose.model(
    "Car",
    new mongoose.Schema({
        model: {
            type: String,
            required: true
        },
        year: {
            type: Number,
            required: true
        }
    })
);
