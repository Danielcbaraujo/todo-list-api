import TodoService from "../services/TodoService.js";

class TodoController {

    async findAll(req, res) {
        const userId = req.user.id;

        const todos = await TodoService.findAll(userId);

        return res.status(200).json(todos);
    }

    async create(req, res) {
        try {
            const data = req.body;
            const userId = req.user.id;
    
            const todo = await TodoService.create(data, userId);
    
            return res.status(201).json(todo);
    
        } catch (error) {
            return res.status(500).json({
                message: "Erro ao criar tarefa"
            });
        }
    }


    async update(req, res) {
        const todoId = req.params.id;
        const userId = req.user.id;
        const data = req.body;
    
        const todo = await TodoService.update(todoId, userId, data);
    }
}
export default new TodoController();

