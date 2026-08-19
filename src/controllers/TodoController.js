import TodoService from "../services/TodoService.js";

class TodoController {

    async findAll(req, res) {

        const userId = req.user.id;

        const completedQuery = req.query.completed;

        let completed;

        if (completedQuery === "true") {
            completed = true;
        } else if (completedQuery === "false") {
            completed = false;
        } else {
            completed = undefined;
        }

        const page = req.query.page === undefined
            ? 1
            : Number(req.query.page);

        const limit = req.query.limit === undefined
            ? 10
            : Number(req.query.limit);

        const sortBy = req.query.sortBy || "createdAt";

        const order = req.query.order || "desc";

        const todos = await TodoService.findAll(
            userId,
            page,
            limit,
            completed,
            sortBy,
            order
        );

        return res.status(200).json(todos);
    }

    async create(req, res) {

        const data = req.body;
        const userId = req.user.id;

        const todo = await TodoService.create(
            data,
            userId
        );

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

        await TodoService.delete(
            todoId,
            userId
        );

        return res.status(204).send();
    }
}

export default new TodoController();