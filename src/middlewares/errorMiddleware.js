import AppError from "../errors/AppError.js";

const errorMiddleware = (error, req, res, next) => {

    let statusCode;
    let message;

    if (error instanceof AppError) {
        statusCode = error.statusCode;
        message = error.message;
    } else {
        statusCode = 500;
        message = "Erro interno do servidor";
    }

    return res.status(statusCode).json({
        message
    });
};

export default errorMiddleware;