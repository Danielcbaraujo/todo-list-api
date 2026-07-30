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

    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
        },
    };
}

async login(data) {
    const { email, password } = data;

    const user = await UserRepository.findByEmail(email);

    if (!user) {
        throw new Error("Email ou senha inválidos");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error("Email ou senha inválidos");
    }

    const token = jwt.sign(
        {
            id: user.id,
            email: user.email
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
    );

    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
        },
    };
}

}

export default UserService;