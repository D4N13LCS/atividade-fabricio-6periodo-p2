const { body, param } = require("express-validator");

const createUserRules = [
    body("name").trim().notEmpty().withMessage("Nome é obrigatório"),
    body("email").trim().isEmail().withMessage("E-mail inválido"),
    body("password")
        .isLength({ min: 6 })
        .withMessage("Senha deve ter no mínimo 6 caracteres")
];

const loginRules = [
    body("email").trim().isEmail().withMessage("E-mail inválido"),
    body("password").notEmpty().withMessage("Senha é obrigatória")
];

const updateUserRules = [
    param("id").isInt({ min: 1 }).withMessage("ID inválido"),
    body("name").optional().trim().notEmpty().withMessage("Nome não pode ser vazio"),
    body("email").optional().trim().isEmail().withMessage("E-mail inválido"),
    body("password")
        .optional()
        .isLength({ min: 6 })
        .withMessage("Senha deve ter no mínimo 6 caracteres")
];

const idParamRule = [
    param("id").isInt({ min: 1 }).withMessage("ID inválido")
];

module.exports = {
    createUserRules,
    loginRules,
    updateUserRules,
    idParamRule
};
