import prisma from "../config/prisma.js";

class TodoRepository {

    async findAll(userId) {
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
                userId
            }
        });
    }

    async findByIdAndUser(todoId, userId) {
        return prisma.todo.findFirst({
            where: {
                id: todoId,
                userId
            }
        });
    }

    async update(todoId, userId, data) {
        return prisma.todo.updateMany({
            where: {
                id: todoId,
                userId
            },
            data: {
                title: data.title,
                description: data.description,
                completed: data.completed
            }
        });
    }
}

export default new TodoRepository();