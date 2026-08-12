import { z } from "zod";


const todoCreateSchema = z.object({
    title: z.string().min(3),
    description: z.string().optional(),
    completed: z.boolean().optional()
});
const todoUpdateSchema = todoCreateSchema
    .partial()
    .refine(
        (data) => Object.keys(data).length > 0,
        {
            message: "Pelo menos um campo deve ser preenchido"
        }
    );

export { todoCreateSchema, todoUpdateSchema };
