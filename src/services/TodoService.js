import TodoRepository from "../repositories/TodoRepository.js";
import AppError from "../errors/AppError.js";

class TodoService {

    async findAll(
        userId,
        page,
        limit,
        completed,
        sortBy,
        order
    ) {

        // Validação da página
        if (page < 1 || !Number.isInteger(page)) {
            throw new AppError(
                "Página inválida",
                400
            );
        }

        // Validação do limite
        if (limit < 1 || !Number.isInteger(limit)) {
            throw new AppError(
                "Limite inválido",
                400
            );
        }

        // Calcula quantos registros devem ser pulados
        const skip = (page - 1) * limit;

        // Campos permitidos para ordenação
        const allowedSortFields = [
            "createdAt",
            "title",
            "completed"
        ];

        // Validação do campo de ordenação
        if (!allowedSortFields.includes(sortBy)) {
            throw new AppError(
                "Campo de ordenação inválido",
                400
            );
        }

        // Validação da ordem
        if (order !== "asc" && order !== "desc") {
            throw new AppError(
                "Ordem de ordenação inválida",
                400
            );
        }

        // Cria o filtro
        const filter = {};

        if (completed !== undefined) {
            filter.completed = completed;
        }

        // Chama o Repository
        const result = await TodoRepository.findAll(
            userId,
            skip,
            limit,
            filter,
            sortBy,
            order
        );

        return {
            data: result.todos,
            page,
            limit,
            total: result.total
        };
    }

    async create(data, userId) {

        const todo = await TodoRepository.create(
            data,
            userId
        );

        return todo;
    }

    async update(todoId, userId, data) {

        const result = await TodoRepository.update(
            todoId,
            userId,
            data
        );

        if (result.count === 0) {
            throw new AppError(
                "Tarefa não encontrada",
                404
            );
        }

        const updatedTodo =
            await TodoRepository.findByIdAndUser(
                todoId,
                userId
            );

        return updatedTodo;
    }

    async delete(todoId, userId) {

        const result = await TodoRepository.delete(
            todoId,
            userId
        );

        if (result.count === 0) {
            throw new AppError(
                "Tarefa não encontrada",
                404
            );
        }

        return {
            message: "Tarefa deletada com sucesso"
        };
    }
}

export default new TodoService();