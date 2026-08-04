import express from "express";
import userRoutes from "./routes/UserRoutes.js";
import todoRoutes from "./routes/TodoRoutes.js";
const app = express();

app.use(express.json());

app.use("/users",userRoutes)
app.use("/todos", todoRoutes);
export default app;