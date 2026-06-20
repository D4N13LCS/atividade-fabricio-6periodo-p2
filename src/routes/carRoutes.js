const express = require("express");
const router = express.Router();
const controller = require("../controllers/carController");
const auth = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validate");
const { mongoIdRule, carRules, carUpdateRules } = require("../validators/resourceValidator");

/**
 * @swagger
 * /cars:
 *   post:
 *     summary: Cria um carro
 *     tags: [Carros]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Car'
 *     responses:
 *       201:
 *         description: Carro criado
 *       401:
 *         description: Token inválido ou ausente
 */
router.post("/", auth, carRules, validate, controller.create);

/**
 * @swagger
 * /cars:
 *   get:
 *     summary: Lista carros
 *     tags: [Carros]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de carros
 *       401:
 *         description: Token inválido ou ausente
 */
router.get("/", auth, controller.findAll);

/**
 * @swagger
 * /cars/{id}:
 *   get:
 *     summary: Busca carro por ID
 *     tags: [Carros]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Carro encontrado
 *       401:
 *         description: Token inválido ou ausente
 *       404:
 *         description: Carro não encontrado
 */
router.get("/:id", auth, mongoIdRule, validate, controller.findById);

/**
 * @swagger
 * /cars/{id}:
 *   put:
 *     summary: Atualiza um carro
 *     tags: [Carros]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Car'
 *     responses:
 *       200:
 *         description: Carro atualizado
 *       401:
 *         description: Token inválido ou ausente
 *       404:
 *         description: Carro não encontrado
 */
router.put("/:id", auth, mongoIdRule, carUpdateRules, validate, controller.update);

/**
 * @swagger
 * /cars/{id}:
 *   delete:
 *     summary: Exclui um carro
 *     tags: [Carros]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Carro excluído
 *       401:
 *         description: Token inválido ou ausente
 *       404:
 *         description: Carro não encontrado
 */
router.delete("/:id", auth, mongoIdRule, validate, controller.delete);

module.exports = router;
