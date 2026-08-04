import express from "express";
import todoController from "../controllers/TodoController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, todoController.create);

router.put("/:id", authMiddleware, todoController.update);

router.get("/", authMiddleware, todoController.findAll);
export default router;