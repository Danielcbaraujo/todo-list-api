import TodoRepository from "../repositories/TodoRepository.js";

class TodoService {

    async findAll(userId) {
        const todos = await TodoRepository.findAll(userId);

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
            const error = new Error("Tarefa não encontrada");
            error.statusCode = 404;

            throw error;
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
            const error = new Error("Tarefa não encontrada");
            error.statusCode = 404;

            throw error;
        }

        return { message: "Tarefa deletada com sucesso" };
    }
}

export default new TodoService();