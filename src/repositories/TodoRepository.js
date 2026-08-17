import prisma from "../config/prisma.js";

class TodoRepository {

async findAll(userId, skip, limit) {

    const todos = await prisma.todo.findMany({
        where: {
            userId
        },
        skip,
        take: limit
    });

    const total = await prisma.todo.count({
        where: {
            userId
        }
    });

    return {
        todos,
        total
    };
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

    async delete(todoId, userId) {
        return prisma.todo.deleteMany({
            where: {
                id: todoId,
                userId
            }
        });
    }
}

export default new TodoRepository();