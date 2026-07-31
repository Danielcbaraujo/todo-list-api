
import prisma from "../config/prisma.js";

class TodoRepository {
    async findAllByUser(userId) {
        return prisma.todo.findMany({
            where: {
                userId
            }
        });
    }

    async create(data,id) {
        return prisma.todo.create({
          data,
        });
      }








}

export default new TodoRepository();