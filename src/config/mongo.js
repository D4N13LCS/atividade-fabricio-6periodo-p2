const mongoose = require("mongoose");

const connectMongo = async () => {

    await mongoose.connect(
        process.env.MONGO_URI,
        {
            serverSelectionTimeoutMS: 5000
        }
    );

    console.log("Mongoose conectado");
};

module.exports = connectMongo;