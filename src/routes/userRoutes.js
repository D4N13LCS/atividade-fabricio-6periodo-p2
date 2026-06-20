const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { authorize, authorizeSelfOrAdmin } = require("../middlewares/authorize");
const validate = require("../middlewares/validate");
const {
    createUserRules,
    loginRules,
    updateUserRules,
    idParamRule
} = require("../validators/userValidator");
const controller = require("../controllers/userController");

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Cria um novo usuário
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       201:
 *         description: Usuário criado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Dados inválidos
 *       409:
 *         description: E-mail já cadastrado
 */
router.post("/", createUserRules, validate, controller.create);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Autentica um usuário e retorna JWT
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Login realizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       401:
 *         description: Credenciais inválidas
 */
router.post("/login", loginRules, validate, controller.login);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Lista todos os usuários
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Token inválido ou ausente
 */
router.get("/", authMiddleware, controller.findAll);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Busca usuário por ID
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Token inválido ou ausente
 *       404:
 *         description: Usuário não encontrado
 */
router.get("/:id", authMiddleware, idParamRule, validate, controller.findById);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Atualiza um usuário
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuário atualizado
 *       401:
 *         description: Token inválido ou ausente
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Usuário não encontrado
 */
router.put(
    "/:id",
    authMiddleware,
    authorizeSelfOrAdmin,
    updateUserRules,
    validate,
    controller.update
);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Exclui um usuário (somente admin)
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Usuário excluído
 *       401:
 *         description: Token inválido ou ausente
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Usuário não encontrado
 */
router.delete(
    "/:id",
    authMiddleware,
    authorize("admin"),
    idParamRule,
    validate,
    controller.delete
);

module.exports = router;
