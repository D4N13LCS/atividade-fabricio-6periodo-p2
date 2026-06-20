require("dotenv").config();

const app = require("./app");
const { initializeDatabase } = require("./database");

const PORT = process.env.PORT || 3000;

const start = async () => {
    await initializeDatabase();
    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
    });
};

start().catch((error) => {
    console.error("Falha ao iniciar o servidor:", error);
    process.exit(1);
});
