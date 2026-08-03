
import prisma from "../config/prisma.js";

class TodoRepository {
    async findAllByUser(userId) {
        return prisma.todo.findMany({
            where: {
                userId
            }
        });
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