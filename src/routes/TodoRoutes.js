import express from "express";
import todoController from "../controllers/TodoController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import validate from "../middlewares/validate.js";
import {todoCreateSchema, todoUpdateSchema} from "../schemas/todoSchema.js";

const router = express.Router();

router.post("/", authMiddleware, validate(todoCreateSchema), todoController.create);

router.put("/:id", authMiddleware, validate(todoUpdateSchema),todoController.update);

router.get("/", authMiddleware, todoController.findAll);

router.delete("/:id", authMiddleware, todoController.delete);


export default router;