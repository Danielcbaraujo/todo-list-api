import TodoRepository from "../repositories/TodoRepository.js";

class TodoService {

    async findAll(userId) {
        const todos = await TodoRepository.findAllByUser(userId);

        return todos;
    }

    async create(data, userId) {
        const todo = await TodoRepository.create(data, userId);
    
        return todo;
    }
    
    async update(todoId, userId, data) {

        const result = await TodoRepository.update(
            todoId,
            userId,
            data
        );
    
        if (result.count === 0) {
            throw new Error("Tarefa não encontrada");
        }
    
        return result;
    }
    }


export default new TodoService();
