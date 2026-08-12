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
        try {
            const todoId = Number(req.params.id);
            const userId = req.user.id;
            const data = req.body;
    
            const todo = await TodoService.update(
                todoId,
                userId,
                data
            );
    
            return res.status(200).json(todo);
    
        } catch (error) {
            const statusCode = error.statusCode || 500;
    
            return res.status(statusCode).json({
                message: error.message
            });
        }
    }
    
    async delete(req, res) {
    try {
        console.log("PARAMS:", req.params);
        console.log("ID:", req.params.id);

        const todoId = Number(req.params.id);
        const userId = req.user.id;

        console.log("todoId:", todoId);
        console.log("userId:", userId);

        const result = await TodoService.delete(todoId, userId);

        return res.status(200).json(result);

    } catch (error) {
        const statusCode = error.statusCode || 500;

        return res.status(statusCode).json({
            message: error.message
        });
    }
}


}
export  default new TodoController();



