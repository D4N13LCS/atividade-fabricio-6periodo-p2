const express = require("express");
const router = express.Router();
const controller = require("../controllers/motoController");
const auth = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validate");
const { mongoIdRule, motoRules, motoUpdateRules } = require("../validators/resourceValidator");

/**
 * @swagger
 * /motos:
 *   post:
 *     summary: Cria uma moto
 *     tags: [Motos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Moto'
 *     responses:
 *       201:
 *         description: Moto criada
 *       401:
 *         description: Token inválido ou ausente
 */
router.post("/", auth, motoRules, validate, controller.create);

/**
 * @swagger
 * /motos:
 *   get:
 *     summary: Lista motos
 *     tags: [Motos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de motos
 *       401:
 *         description: Token inválido ou ausente
 */
router.get("/", auth, controller.findAll);

/**
 * @swagger
 * /motos/{id}:
 *   get:
 *     summary: Busca moto por ID
 *     tags: [Motos]
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
 *         description: Moto encontrada
 *       401:
 *         description: Token inválido ou ausente
 *       404:
 *         description: Moto não encontrada
 */
router.get("/:id", auth, mongoIdRule, validate, controller.findById);

/**
 * @swagger
 * /motos/{id}:
 *   put:
 *     summary: Atualiza uma moto
 *     tags: [Motos]
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
 *             $ref: '#/components/schemas/Moto'
 *     responses:
 *       200:
 *         description: Moto atualizada
 *       401:
 *         description: Token inválido ou ausente
 *       404:
 *         description: Moto não encontrada
 */
router.put("/:id", auth, mongoIdRule, motoUpdateRules, validate, controller.update);

/**
 * @swagger
 * /motos/{id}:
 *   delete:
 *     summary: Exclui uma moto
 *     tags: [Motos]
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
 *         description: Moto excluída
 *       401:
 *         description: Token inválido ou ausente
 *       404:
 *         description: Moto não encontrada
 */
router.delete("/:id", auth, mongoIdRule, validate, controller.delete);

module.exports = router;
