require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");

const userRoutes = require("./routes/userRoutes");
const carRoutes = require("./routes/carRoutes");
const motoRoutes = require("./routes/motoRoutes");
const clothingBrandRoutes = require("./routes/clothingBrandRoutes");
const swaggerSetup = require("./config/swagger");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

const corsOrigin = process.env.CORS_ORIGIN || "*";

app.use(helmet());
app.use(cors({
    origin: corsOrigin === "*" ? true : corsOrigin.split(","),
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json({ limit: "10kb" }));
app.use(mongoSanitize());

swaggerSetup(app);

app.use("/users", userRoutes);
app.use("/cars", carRoutes);
app.use("/motos", motoRoutes);
app.use("/brands", clothingBrandRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "API funcionando",
        docs: "/api-docs"
    });
});

app.use((req, res) => {
    res.status(404).json({ message: "Rota não encontrada" });
});

app.use(errorHandler);

module.exports = app;
