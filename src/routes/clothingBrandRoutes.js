const express = require("express");
const router = express.Router();
const controller = require("../controllers/clothingBrandController");
const auth = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validate");
const { mongoIdRule, brandRules, brandUpdateRules } = require("../validators/resourceValidator");

/**
 * @swagger
 * /brands:
 *   post:
 *     summary: Cria uma marca de roupa
 *     tags: [Marcas de Roupa]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ClothingBrand'
 *     responses:
 *       201:
 *         description: Marca criada
 *       401:
 *         description: Token inválido ou ausente
 */
router.post("/", auth, brandRules, validate, controller.create);

/**
 * @swagger
 * /brands:
 *   get:
 *     summary: Lista marcas de roupa
 *     tags: [Marcas de Roupa]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de marcas
 *       401:
 *         description: Token inválido ou ausente
 */
router.get("/", auth, controller.findAll);

/**
 * @swagger
 * /brands/{id}:
 *   get:
 *     summary: Busca marca por ID
 *     tags: [Marcas de Roupa]
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
 *         description: Marca encontrada
 *       401:
 *         description: Token inválido ou ausente
 *       404:
 *         description: Marca não encontrada
 */
router.get("/:id", auth, mongoIdRule, validate, controller.findById);

/**
 * @swagger
 * /brands/{id}:
 *   put:
 *     summary: Atualiza uma marca de roupa
 *     tags: [Marcas de Roupa]
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
 *             $ref: '#/components/schemas/ClothingBrand'
 *     responses:
 *       200:
 *         description: Marca atualizada
 *       401:
 *         description: Token inválido ou ausente
 *       404:
 *         description: Marca não encontrada
 */
router.put("/:id", auth, mongoIdRule, brandUpdateRules, validate, controller.update);

/**
 * @swagger
 * /brands/{id}:
 *   delete:
 *     summary: Exclui uma marca de roupa
 *     tags: [Marcas de Roupa]
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
 *         description: Marca excluída
 *       401:
 *         description: Token inválido ou ausente
 *       404:
 *         description: Marca não encontrada
 */
router.delete("/:id", auth, mongoIdRule, validate, controller.delete);

module.exports = router;
