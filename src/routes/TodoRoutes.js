import express from "express";

import todoController from "../controllers/TodoController.js";

import authMiddleware from "../middlewares/authMiddleware.js";

import validate from "../middlewares/validate.js";

import {
    todoCreateSchema,
    todoUpdateSchema
} from "../schemas/todoSchema.js";

const router = express.Router();


/**
 * @swagger
 * /todos:
 *   post:
 *     summary: Criar uma nova tarefa
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: Estudar Jest
 *               description:
 *                 type: string
 *                 example: Criar testes automatizados
 *               completed:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       201:
 *         description: Tarefa criada com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Usuário não autenticado
 */
router.post(
    "/",
    authMiddleware,
    validate(todoCreateSchema),
    todoController.create
);


/**
 * @swagger
 * /todos/{id}:
 *   put:
 *     summary: Atualizar uma tarefa
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Estudar Node.js
 *               description:
 *                 type: string
 *                 example: Revisar Express e Prisma
 *               completed:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Tarefa atualizada com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Usuário não autenticado
 *       404:
 *         description: Tarefa não encontrada
 */
router.put(
    "/:id",
    authMiddleware,
    validate(todoUpdateSchema),
    todoController.update
);


/**
 * @swagger
 * /todos:
 *   get:
 *     summary: Listar tarefas do usuário autenticado
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número da página
 *
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 10
 *         description: Quantidade de tarefas por página
 *
 *       - in: query
 *         name: completed
 *         schema:
 *           type: boolean
 *         description: Filtrar por tarefas concluídas ou pendentes
 *
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum:
 *             - createdAt
 *             - title
 *             - completed
 *           default: createdAt
 *         description: Campo utilizado para ordenação
 *
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum:
 *             - asc
 *             - desc
 *           default: desc
 *         description: Direção da ordenação
 *
 *     responses:
 *       200:
 *         description: Lista de tarefas retornada com sucesso
 *       400:
 *         description: Parâmetros inválidos
 *       401:
 *         description: Usuário não autenticado
 */
router.get(
    "/",
    authMiddleware,
    todoController.findAll
);


/**
 * @swagger
 * /todos/{id}:
 *   delete:
 *     summary: Deletar uma tarefa
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       204:
 *         description: Tarefa deletada com sucesso
 *       401:
 *         description: Usuário não autenticado
 *       404:
 *         description: Tarefa não encontrada
 */
router.delete(
    "/:id",
    authMiddleware,
    todoController.delete
);


export default router;