import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserRepository from "../repositories/UserRepository.js";

class UserService {
   
async register(data) {
    const { name, email, password } = data;

    const checkEmail = await UserRepository.findByEmail(email);

    if (checkEmail) {
        return "Email já cadastrado";
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await UserRepository.create({
        name,
        email,
        password: hashedPassword,
    });

    const token = jwt.sign(
        {
            id: user.id,
            email: user.email,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d",
        }
    );

    return token;
}
}

export default UserService;