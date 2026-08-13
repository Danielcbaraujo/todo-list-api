import TodoService from "../services/TodoService.js";

class TodoController {

    async findAll(req, res) {
        const userId = req.user.id;

        const todos = await TodoService.findAll(userId);

        return res.status(200).json(todos);
    }

    async create(req, res) {
        const data = req.body;
        const userId = req.user.id;

        const todo = await TodoService.create(data, userId);

        return res.status(201).json(todo);
    }

    async update(req, res) {
        const todoId = Number(req.params.id);
        const userId = req.user.id;
        const data = req.body;

        const todo = await TodoService.update(
            todoId,
            userId,
            data
        );

        return res.status(200).json(todo);
    }

    async delete(req, res) {
        const todoId = Number(req.params.id);
        const userId = req.user.id;

        const result = await TodoService.delete(todoId, userId);

        return res.status(200).json(result);
    }
}

export default new TodoController();