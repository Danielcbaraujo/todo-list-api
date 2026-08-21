import express from "express";

import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";

import userRoutes from "./routes/UserRoutes.js";
import todoRoutes from "./routes/TodoRoutes.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";

const app = express();

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/users", userRoutes);
app.use("/todos", todoRoutes);

app.use(errorMiddleware);

export default app;