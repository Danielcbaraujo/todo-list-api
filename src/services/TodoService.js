import TodoRepository from "../repositories/TodoRepository.js";

class TodoService {

    async findAll(userId) {
        const todos = await TodoRepository.findAllByUser(userId);

        return todos;
    }

    async create(data, userId){
       
        const todo=await TodoRepository.create(data, userId){
            return 
        }


    }

}

export default new TodoService();
