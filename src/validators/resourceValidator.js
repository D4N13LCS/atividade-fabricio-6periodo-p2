const { body, param } = require("express-validator");

const mongoIdRule = [
    param("id").isMongoId().withMessage("ID inválido")
];

const carRules = [
    body("model").trim().notEmpty().withMessage("Modelo é obrigatório"),
    body("year").isInt({ min: 1886 }).withMessage("Ano inválido")
];

const carUpdateRules = [
    body("model").optional().trim().notEmpty().withMessage("Modelo não pode ser vazio"),
    body("year").optional().isInt({ min: 1886 }).withMessage("Ano inválido")
];

const motoRules = [
    body("model").trim().notEmpty().withMessage("Modelo é obrigatório"),
    body("year").isInt({ min: 1885 }).withMessage("Ano inválido")
];

const motoUpdateRules = [
    body("model").optional().trim().notEmpty().withMessage("Modelo não pode ser vazio"),
    body("year").optional().isInt({ min: 1885 }).withMessage("Ano inválido")
];

const brandRules = [
    body("name").trim().notEmpty().withMessage("Nome é obrigatório"),
    body("country").trim().notEmpty().withMessage("País é obrigatório")
];

const brandUpdateRules = [
    body("name").optional().trim().notEmpty().withMessage("Nome não pode ser vazio"),
    body("country").optional().trim().notEmpty().withMessage("País não pode ser vazio")
];

module.exports = {
    mongoIdRule,
    carRules,
    carUpdateRules,
    motoRules,
    motoUpdateRules,
    brandRules,
    brandUpdateRules
};
