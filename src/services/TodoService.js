import TodoRepository from "../repositories/TodoRepository.js";
import AppError from "../errors/AppError.js";


class TodoService {

async findAll(userId, page, limit) {

    const skip = (page - 1) * limit;

    const result = await TodoRepository.findAll(
        userId,
        skip,
        limit
    );

    return {
        data: result.todos,
        page,
        limit,
        total: result.total
    };
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
       throw new AppError("Tarefa não encontrada", 404);
}
        const updatedTodo = await TodoRepository.findByIdAndUser(
            todoId,
            userId
        );

        return updatedTodo;
    }

    async delete(todoId, userId) {
        const result = await TodoRepository.delete(todoId, userId);

   if (result.count === 0) {
    throw new AppError("Tarefa não encontrada", 404);
}

        return { message: "Tarefa deletada com sucesso" };
    }
}

export default new TodoService();