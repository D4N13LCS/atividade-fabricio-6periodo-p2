const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Atividade API",
            version: "1.0.0",
            description: "API com persistência SQL (MySQL) e NoSQL (MongoDB), autenticação JWT e documentação automática."
        },
        servers: [
            {
                url: process.env.API_URL || "http://localhost:3000",
                description: "Servidor principal"
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            },
            schemas: {
                User: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: 1 },
                        name: { type: "string", example: "João Silva" },
                        email: { type: "string", example: "joao@email.com" },
                        role: { type: "string", example: "user" },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" }
                    }
                },
                UserInput: {
                    type: "object",
                    required: ["name", "email", "password"],
                    properties: {
                        name: { type: "string", example: "João Silva" },
                        email: { type: "string", example: "joao@email.com" },
                        password: { type: "string", example: "senha123" }
                    }
                },
                LoginInput: {
                    type: "object",
                    required: ["email", "password"],
                    properties: {
                        email: { type: "string", example: "joao@email.com" },
                        password: { type: "string", example: "senha123" }
                    }
                },
                LoginResponse: {
                    type: "object",
                    properties: {
                        token: { type: "string" }
                    }
                },
                Car: {
                    type: "object",
                    properties: {
                        _id: { type: "string" },
                        model: { type: "string", example: "Corolla" },
                        year: { type: "integer", example: 2024 }
                    }
                },
                Moto: {
                    type: "object",
                    properties: {
                        _id: { type: "string" },
                        model: { type: "string", example: "CB500" },
                        year: { type: "integer", example: 2023 }
                    }
                },
                ClothingBrand: {
                    type: "object",
                    properties: {
                        _id: { type: "string" },
                        name: { type: "string", example: "Nike" },
                        country: { type: "string", example: "EUA" }
                    }
                },
                Error: {
                    type: "object",
                    properties: {
                        message: { type: "string" }
                    }
                }
            }
        }
    },
    apis: ["./src/routes/*.js"]
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = (app) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    app.get("/api-docs.json", (req, res) => {
        res.json(swaggerSpec);
    });
};
