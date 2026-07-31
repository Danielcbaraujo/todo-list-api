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
    
    }



export default new TodoController();








export default new TodoController();
