const mongoose = require("mongoose");

module.exports = mongoose.model(
    "ClothingBrand",
    new mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        }
    })
);