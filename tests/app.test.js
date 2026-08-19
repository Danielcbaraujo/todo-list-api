import request from "supertest";
import app from "../src/app.js";
import prisma from "../src/config/prisma.js";


describe("GET /todos", () => {

    it("deve retornar 401 quando não enviar token", async () => {

        const response = await request(app)
            .get("/todos");

        expect(response.status).toBe(401);
    });


    it("deve retornar 401 quando o token for inválido", async () => {

        const response = await request(app)
            .get("/todos")
            .set(
                "Authorization",
                "Bearer token_invalido_123"
            );

        expect(response.status).toBe(401);
    });

});


describe("POST /users/register", () => {

    it("deve registrar um novo usuário", async () => {

        const email = `teste${Date.now()}@email.com`;

        const response = await request(app)
            .post("/users/register")
            .send({
                name: "Usuário Teste",
                email,
                password: "123456"
            });

        expect(response.status).toBe(201);

        expect(response.body.token).toBeDefined();

        expect(response.body.user).toEqual(
            expect.objectContaining({
                name: "Usuário Teste",
                email
            })
        );

        await prisma.user.delete({
            where: {
                email
            }
        });
    });


    it("deve retornar 409 quando o email já estiver cadastrado", async () => {

        const email = `duplicado${Date.now()}@email.com`;

        await request(app)
            .post("/users/register")
            .send({
                name: "Usuario Teste",
                email,
                password: "123456"
            });

        const response = await request(app)
            .post("/users/register")
            .send({
                name: "Outro Usuario",
                email,
                password: "123456"
            });

        expect(response.status).toBe(409);

        await prisma.user.delete({
            where: {
                email
            }
        });
    });

});


describe("POST /users/login", () => {

    it("deve realizar login com credenciais válidas", async () => {

        const email = `login${Date.now()}@email.com`;
        const password = "123456";

        await request(app)
            .post("/users/register")
            .send({
                name: "Usuario Login",
                email,
                password
            });

        const response = await request(app)
            .post("/users/login")
            .send({
                email,
                password
            });

        expect(response.status).toBe(200);

        expect(response.body.token).toBeDefined();

        expect(response.body.user.email).toBe(email);

        await prisma.user.delete({
            where: {
                email
            }
        });
    });


    it("deve retornar 401 quando a senha estiver incorreta", async () => {

        const email = `senha${Date.now()}@email.com`;
        const password = "123456";
        const wrongPassword = "senhaErrada";

        await request(app)
            .post("/users/register")
            .send({
                name: "Usuario Login",
                email,
                password
            });

        const response = await request(app)
            .post("/users/login")
            .send({
                email,
                password: wrongPassword
            });

        expect(response.status).toBe(401);

        await prisma.user.delete({
            where: {
                email
            }
        });
    });


    it("deve retornar 401 quando o email não existir", async () => {

        const email = "naoexiste123456@email.com";
        const password = "123456";

        const response = await request(app)
            .post("/users/login")
            .send({
                email,
                password
            });

        expect(response.status).toBe(401);
    });

});