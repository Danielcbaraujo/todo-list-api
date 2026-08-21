import request from "supertest";
import app from "../src/app.js";
import prisma from "../src/config/prisma.js";

describe("GET /todos", () => {
    it("deve retornar 401 quando não enviar token", async () => {
        const response = await request(app).get("/todos");

        expect(response.status).toBe(401);
    });

    it("deve retornar 401 quando o token for inválido", async () => {
        const response = await request(app)
            .get("/todos")
            .set("Authorization", "Bearer token_invalido_123");

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
            where: { email }
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
            where: { email }
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
            where: { email }
        });
    });


    it("deve retornar 401 quando a senha estiver incorreta", async () => {
        const email = `senha${Date.now()}@email.com`;
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
                password: "senhaErrada"
            });

        expect(response.status).toBe(401);

        await prisma.user.delete({
            where: { email }
        });
    });


    it("deve retornar 401 quando o email não existir", async () => {
        const response = await request(app)
            .post("/users/login")
            .send({
                email: "naoexiste123456@email.com",
                password: "123456"
            });

        expect(response.status).toBe(401);
    });
});


describe("POST /todos", () => {

    it("deve criar uma tarefa para um usuário autenticado", async () => {
        const email = `todo${Date.now()}@email.com`;
        const password = "123456";

        await request(app)
            .post("/users/register")
            .send({
                name: "Usuario Todo",
                email,
                password
            });

        const loginResponse = await request(app)
            .post("/users/login")
            .send({
                email,
                password
            });

        const token = loginResponse.body.token;

        const todoResponse = await request(app)
            .post("/todos")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Estudar Jest",
                description: "Criar testes automatizados",
                completed: false
            });

        expect(todoResponse.status).toBe(201);

        await prisma.todo.delete({
            where: {
                id: todoResponse.body.id
            }
        });

        await prisma.user.delete({
            where: { email }
        });
    });


    it("deve retornar 401 quando não enviar token", async () => {
        const response = await request(app)
            .post("/todos")
            .send({
                title: "Teste sem autenticação",
                description: "Não deve criar",
                completed: false
            });

        expect(response.status).toBe(401);
    });
});


describe("PUT /todos/:id", () => {

    it("deve retornar 404 quando um usuário tentar alterar o Todo de outro usuário", async () => {

        const password = "123456";

        const mariaEmail = `maria${Date.now()}@email.com`;
        const joaoEmail = `joao${Date.now()}@email.com`;

        await request(app)
            .post("/users/register")
            .send({
                name: "Maria",
                email: mariaEmail,
                password
            });

        const mariaLogin = await request(app)
            .post("/users/login")
            .send({
                email: mariaEmail,
                password
            });

        const todoResponse = await request(app)
            .post("/todos")
            .set("Authorization", `Bearer ${mariaLogin.body.token}`)
            .send({
                title: "Todo da Maria",
                description: "Tarefa privada",
                completed: false
            });

        await request(app)
            .post("/users/register")
            .send({
                name: "João",
                email: joaoEmail,
                password
            });

        const joaoLogin = await request(app)
            .post("/users/login")
            .send({
                email: joaoEmail,
                password
            });

        const response = await request(app)
            .put(`/todos/${todoResponse.body.id}`)
            .set("Authorization", `Bearer ${joaoLogin.body.token}`)
            .send({
                title: "João tentando alterar",
                description: "Não deveria conseguir",
                completed: true
            });

        expect(response.status).toBe(404);

        await prisma.todo.delete({
            where: {
                id: todoResponse.body.id
            }
        });

        await prisma.user.delete({
            where: {
                email: mariaEmail
            }
        });

        await prisma.user.delete({
            where: {
                email: joaoEmail
            }
        });
    });


    it("deve atualizar o Todo do próprio usuário", async () => {

        const email = `update${Date.now()}@email.com`;
        const password = "123456";

        await request(app)
            .post("/users/register")
            .send({
                name: "Maria Update",
                email,
                password
            });

        const loginResponse = await request(app)
            .post("/users/login")
            .send({
                email,
                password
            });

        const token = loginResponse.body.token;

        const todoResponse = await request(app)
            .post("/todos")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Título original",
                description: "Descrição original",
                completed: false
            });

        const response = await request(app)
            .put(`/todos/${todoResponse.body.id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Título atualizado",
                description: "Descrição atualizada",
                completed: true
            });

        expect(response.status).toBe(200);
        expect(response.body.title).toBe("Título atualizado");
        expect(response.body.completed).toBe(true);

        await prisma.todo.delete({
            where: {
                id: todoResponse.body.id
            }
        });

        await prisma.user.delete({
            where: { email }
        });
    });


    it("deve retornar 401 quando não enviar token", async () => {

        const email = `update401${Date.now()}@email.com`;
        const password = "123456";

        await request(app)
            .post("/users/register")
            .send({
                name: "Usuario Update",
                email,
                password
            });

        const loginResponse = await request(app)
            .post("/users/login")
            .send({
                email,
                password
            });

        const todoResponse = await request(app)
            .post("/todos")
            .set("Authorization", `Bearer ${loginResponse.body.token}`)
            .send({
                title: "Estudar Jest",
                description: "Criar testes automatizados",
                completed: false
            });

        const response = await request(app)
            .put(`/todos/${todoResponse.body.id}`)
            .send({
                title: "Tentativa sem token",
                description: "Não deve atualizar",
                completed: true
            });

        expect(response.status).toBe(401);

        await prisma.todo.delete({
            where: {
                id: todoResponse.body.id
            }
        });

        await prisma.user.delete({
            where: { email }
        });
    });


    it("deve retornar 404 quando o Todo não existir", async () => {

        const email = `inexistente${Date.now()}@email.com`;
        const password = "123456";

        await request(app)
            .post("/users/register")
            .send({
                name: "Usuario Inexistente",
                email,
                password
            });

        const loginResponse = await request(app)
            .post("/users/login")
            .send({
                email,
                password
            });

        const response = await request(app)
            .put("/todos/999999")
            .set("Authorization", `Bearer ${loginResponse.body.token}`)
            .send({
                title: "Todo inexistente",
                description: "Não deveria atualizar",
                completed: true
            });

        expect(response.status).toBe(404);

        await prisma.user.delete({
            where: { email }
        });
    });
});


describe("DELETE /todos/:id", () => {

    it("deve deletar o Todo do próprio usuário", async () => {

        const email = `delete${Date.now()}@email.com`;
        const password = "123456";

        await request(app)
            .post("/users/register")
            .send({
                name: "Usuario Delete",
                email,
                password
            });

        const loginResponse = await request(app)
            .post("/users/login")
            .send({
                email,
                password
            });

        const todoResponse = await request(app)
            .post("/todos")
            .set("Authorization", `Bearer ${loginResponse.body.token}`)
            .send({
                title: "Todo para deletar",
                description: "Teste DELETE",
                completed: false
            });

        const response = await request(app)
            .delete(`/todos/${todoResponse.body.id}`)
            .set("Authorization", `Bearer ${loginResponse.body.token}`);

        expect(response.status).toBe(204);

        await prisma.user.delete({
            where: { email }
        });
    });


    it("deve retornar 404 quando outro usuário tentar deletar o Todo", async () => {

        const password = "123456";

        const mariaEmail = `mariadelete${Date.now()}@email.com`;
        const joaoEmail = `joaodelete${Date.now()}@email.com`;

        await request(app)
            .post("/users/register")
            .send({
                name: "Maria",
                email: mariaEmail,
                password
            });

        const mariaLogin = await request(app)
            .post("/users/login")
            .send({
                email: mariaEmail,
                password
            });

        const todoResponse = await request(app)
            .post("/todos")
            .set("Authorization", `Bearer ${mariaLogin.body.token}`)
            .send({
                title: "Todo da Maria",
                description: "Tarefa privada",
                completed: false
            });

        await request(app)
            .post("/users/register")
            .send({
                name: "João",
                email: joaoEmail,
                password
            });

        const joaoLogin = await request(app)
            .post("/users/login")
            .send({
                email: joaoEmail,
                password
            });

        const response = await request(app)
            .delete(`/todos/${todoResponse.body.id}`)
            .set("Authorization", `Bearer ${joaoLogin.body.token}`);

        expect(response.status).toBe(404);

        await prisma.todo.delete({
            where: {
                id: todoResponse.body.id
            }
        });

        await prisma.user.delete({
            where: {
                email: mariaEmail
            }
        });

        await prisma.user.delete({
            where: {
                email: joaoEmail
            }
        });
    });


    it("deve retornar 401 quando tentar deletar sem token", async () => {

        const email = `deletetoken${Date.now()}@email.com`;
        const password = "123456";

        await request(app)
            .post("/users/register")
            .send({
                name: "Usuario Delete",
                email,
                password
            });

        const loginResponse = await request(app)
            .post("/users/login")
            .send({
                email,
                password
            });

        const todoResponse = await request(app)
            .post("/todos")
            .set("Authorization", `Bearer ${loginResponse.body.token}`)
            .send({
                title: "Todo protegido",
                description: "Teste token",
                completed: false
            });

        const response = await request(app)
            .delete(`/todos/${todoResponse.body.id}`);

        expect(response.status).toBe(401);

        await prisma.todo.delete({
            where: {
                id: todoResponse.body.id
            }
        });

        await prisma.user.delete({
            where: { email }
        });
    });
});


describe("GET /todos - autenticado", () => {

    it("deve retornar 200 para usuário autenticado", async () => {

        const email = `list${Date.now()}@email.com`;
        const password = "123456";

        await request(app)
            .post("/users/register")
            .send({
                name: "Usuario Lista",
                email,
                password
            });

        const loginResponse = await request(app)
            .post("/users/login")
            .send({
                email,
                password
            });

        const response = await request(app)
            .get("/todos")
            .set(
                "Authorization",
                `Bearer ${loginResponse.body.token}`
            );

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("data");
        expect(response.body).toHaveProperty("page");
        expect(response.body).toHaveProperty("limit");
        expect(response.body).toHaveProperty("total");

        await prisma.user.delete({
            where: { email }
        });
    });
});


describe("GET /todos - filtros e validações", () => {

    it("deve retornar somente tarefas concluídas", async () => {

        const email = `completedtrue${Date.now()}@email.com`;
        const password = "123456";

        await request(app)
            .post("/users/register")
            .send({
                name: "Usuario Filtro",
                email,
                password
            });

        const loginResponse = await request(app)
            .post("/users/login")
            .send({
                email,
                password
            });

        const token = loginResponse.body.token;

        const completed = await request(app)
            .post("/todos")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Concluído",
                description: "Teste filtro",
                completed: true
            });

        const pending = await request(app)
            .post("/todos")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Pendente",
                description: "Teste filtro",
                completed: false
            });

        const response = await request(app)
            .get("/todos?completed=true")
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);

        expect(
            response.body.data.every(todo => todo.completed === true)
        ).toBe(true);

        await prisma.todo.deleteMany({
            where: {
                id: {
                    in: [
                        completed.body.id,
                        pending.body.id
                    ]
                }
            }
        });

        await prisma.user.delete({
            where: { email }
        });
    });


    it("deve retornar somente tarefas pendentes", async () => {

        const email = `completedfalse${Date.now()}@email.com`;
        const password = "123456";

        await request(app)
            .post("/users/register")
            .send({
                name: "Usuario Filtro",
                email,
                password
            });

        const loginResponse = await request(app)
            .post("/users/login")
            .send({
                email,
                password
            });

        const token = loginResponse.body.token;

        const completed = await request(app)
            .post("/todos")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Concluído",
                description: "Teste filtro",
                completed: true
            });

        const pending = await request(app)
            .post("/todos")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Pendente",
                description: "Teste filtro",
                completed: false
            });

        const response = await request(app)
            .get("/todos?completed=false")
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);

        expect(
            response.body.data.every(todo => todo.completed === false)
        ).toBe(true);

        await prisma.todo.deleteMany({
            where: {
                id: {
                    in: [
                        completed.body.id,
                        pending.body.id
                    ]
                }
            }
        });

        await prisma.user.delete({
            where: { email }
        });
    });


    it("deve retornar 400 quando a página for inválida", async () => {

        const email = `page${Date.now()}@email.com`;
        const password = "123456";

        await request(app)
            .post("/users/register")
            .send({
                name: "Usuario Page",
                email,
                password
            });

        const loginResponse = await request(app)
            .post("/users/login")
            .send({
                email,
                password
            });

        const response = await request(app)
            .get("/todos?page=0")
            .set(
                "Authorization",
                `Bearer ${loginResponse.body.token}`
            );

        expect(response.status).toBe(400);

        await prisma.user.delete({
            where: { email }
        });
    });


    it("deve retornar 400 quando o limite for inválido", async () => {

        const email = `limit${Date.now()}@email.com`;
        const password = "123456";

        await request(app)
            .post("/users/register")
            .send({
                name: "Usuario Limit",
                email,
                password
            });

        const loginResponse = await request(app)
            .post("/users/login")
            .send({
                email,
                password
            });

        const response = await request(app)
            .get("/todos?limit=0")
            .set(
                "Authorization",
                `Bearer ${loginResponse.body.token}`
            );

        expect(response.status).toBe(400);

        await prisma.user.delete({
            where: { email }
        });
    });


    it("deve retornar 400 quando o campo de ordenação for inválido", async () => {

        const email = `sort${Date.now()}@email.com`;
        const password = "123456";

        await request(app)
            .post("/users/register")
            .send({
                name: "Usuario Sort",
                email,
                password
            });

        const loginResponse = await request(app)
            .post("/users/login")
            .send({
                email,
                password
            });

        const response = await request(app)
            .get("/todos?sortBy=banana")
            .set(
                "Authorization",
                `Bearer ${loginResponse.body.token}`
            );

        expect(response.status).toBe(400);

        await prisma.user.delete({
            where: { email }
        });
    });

});