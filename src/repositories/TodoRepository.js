
import prisma from "../config/prisma.js";

class TodoRepository {
    async findAll(req, res) {
        try {
            const userId = req.user.id;
            const todos = await TodoService.findAll(userId);
            return res.status(200).json(todos);
        } catch (error) {
            return res.status(500).json({ message: "Erro ao buscar tarefas" });
        }
    }

    async create(data, userId) {
        return prisma.todo.create({
            data: {                  
                title: data.title,
                description: data.description,
                userId: userId
            }
        });
    }

    async findByIdAndUser(todoId, userId) {
        if (!todo) {
            throw new Error("Tarefa não encontrada");
        }
        
        return prisma.todo.findFirst({
            where: {
                id: todoId,
                userId: userId
            },

        
        });
    }
    async update(todoId, userId, data) {
        return prisma.todo.updateMany({
            where: {
                id: todoId,
                userId: userId
            },
            data: {
                title: data.title,
                description: data.description
            }
        });
    }
}


export default new TodoRepository();