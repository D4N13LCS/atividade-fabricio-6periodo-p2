const sequelize = require("./config/mysql");
const connectMongo = require("./config/mongo");

const initializeDatabase = async (maxRetries = Infinity) => {
    let attempt = 0;

    while (attempt < maxRetries) {
        try {
            await sequelize.authenticate();
            await sequelize.sync();
            await connectMongo();
            return;
        } catch (error) {
            attempt += 1;
            console.log("Aguardando bancos ficarem disponíveis...");
            if (attempt >= maxRetries) {
                throw error;
            }
            await new Promise((resolve) => setTimeout(resolve, 5000));
        }
    }
};

module.exports = { initializeDatabase, sequelize };
