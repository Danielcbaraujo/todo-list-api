import UserService from "../services/UserService.js";

class UserController {
    async register(req, res) {
        try {
            const result = await UserService.register(req.body);
            return res.status(201).json(result);
        } catch (error) {
            const statusCode = error.statusCode || 500;
            return res.status(statusCode).json({ message: error.message });
        }
    }

    async login(req, res) {
        try {
            const result = await UserService.login(req.body);
            return res.status(200).json(result);
        } catch (error) {
            const statusCode = error.statusCode || 401;
            return res.status(statusCode).json({ message: error.message });
        }
    }
}

export default new UserController();