import UserService from "../services/UserService";


class UserController {


 async register(req, res) {
    const token = await userService.register(req.body);

    return res.status(201).json({
        token
    });
}


}