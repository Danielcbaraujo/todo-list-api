# Todo List API

API REST para gerenciamento de tarefas, desenvolvida com Node.js, Express, Prisma e PostgreSQL.

O projeto foi desenvolvido com foco em boas práticas de desenvolvimento backend, arquitetura em camadas, autenticação, validação de dados, tratamento de erros, testes automatizados e documentação da API com Swagger/OpenAPI.

---

## 🚀 Tecnologias

- Node.js
- Express
- PostgreSQL
- Prisma ORM
- JWT (JSON Web Token)
- bcrypt
- Zod
- Jest
- Supertest
- Swagger / OpenAPI
- Nodemon

---

## ✨ Funcionalidades

### 👤 Usuários

- Cadastro de usuários
- Login
- Criptografia de senhas utilizando bcrypt
- Autenticação utilizando JWT
- Validação de email
- Prevenção de cadastro com email duplicado

### 📝 Tarefas

- Criar tarefa
- Listar tarefas
- Atualizar tarefa
- Deletar tarefa
- Filtrar tarefas por status
- Paginação
- Ordenação
- Controle de acesso por usuário

### 🔐 Segurança

- Autenticação JWT
- Hash de senhas com bcrypt
- Validação de dados com Zod
- Middleware de autenticação
- Controle de acesso por usuário
- Usuários não podem alterar tarefas de outros usuários
- Usuários não podem deletar tarefas de outros usuários
- Tratamento centralizado de erros

---

## 🏗️ Arquitetura

O projeto utiliza uma arquitetura em camadas:

```text
Cliente
   ↓
Routes
   ↓
Middleware
   ↓
Controller
   ↓
Service
   ↓
Repository
   ↓
Prisma
   ↓
PostgreSQL
```

### Responsabilidades

**Routes:** definem os endpoints da API.

**Middleware:** executam autenticação, validação e tratamento de erros.

**Controller:** recebem as requisições e retornam as respostas HTTP.

**Service:** contêm as regras de negócio.

**Repository:** responsáveis pelo acesso ao banco de dados.

**Prisma:** realiza a comunicação com o PostgreSQL.

---

## 📋 Pré-requisitos

- Node.js
- npm
- PostgreSQL
- Git

---

## 📁 Estrutura

```text
todo-list-api/
│
├── prisma/
│   └── schema.prisma
│
├── src/
│   ├── config/
│   │   ├── prisma.js
│   │   └── swagger.js
│   │
│   ├── controllers/
│   │   ├── TodoController.js
│   │   └── UserController.js
│   │
│   ├── errors/
│   │   └── AppError.js
│   │
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── validate.js
│   │
│   ├── repositories/
│   │   ├── TodoRepository.js
│   │   └── UserRepository.js
│   │
│   ├── routes/
│   │   ├── TodoRoutes.js
│   │   └── UserRoutes.js
│   │
│   ├── schemas/
│   │   └── todoSchema.js
│   │
│   ├── services/
│   │   ├── TodoService.js
│   │   └── UserService.js
│   │
│   ├── app.js
│   └── server.js
│
├── tests/
│   └── app.test.js
│
├── .gitignore
├── package.json
└── README.md
```

---

## ⚙️ Instalação

Clone o repositório:

```bash
git clone https://github.com/Danielcbaraujo/todo-list-api.git
```

Entre na pasta:

```bash
cd todo-list-api
```

Instale as dependências:

```bash
npm install
```

---

## 🔐 Configuração

Crie um arquivo `.env` na raiz:

```env
DATABASE_URL="sua_connection_string"
JWT_SECRET="sua_chave_secreta"
PORT=3000
```

| Variável | Descrição |
|---|---|
| `DATABASE_URL` | Conexão com PostgreSQL |
| `JWT_SECRET` | Chave utilizada pelo JWT |
| `PORT` | Porta da aplicação |

> O arquivo `.env` não deve ser versionado.

---

## 🗄️ Banco de dados

Execute as migrations:

```bash
npx prisma migrate dev
```

Para abrir o Prisma Studio:

```bash
npx prisma studio
```

---

## ▶️ Executando

### Desenvolvimento

```bash
npm run dev
```

### Produção

```bash
npm start
```

A API será executada em:

```text
http://localhost:3000
```

---

## 📚 Swagger

Documentação interativa:

```text
http://localhost:3000/api-docs
```

No Swagger é possível visualizar endpoints, schemas, parâmetros, respostas e executar requisições autenticadas com JWT.

---

## 🔑 Autenticação

O projeto utiliza JWT.

Após o login, envie o token nas rotas protegidas:

```http
Authorization: Bearer SEU_TOKEN
```

---

# 📌 Endpoints

## Usuários

### `POST /users/register`

Cadastro:

```json
{
  "name": "Daniel",
  "email": "daniel@email.com",
  "password": "123456"
}
```

### `POST /users/login`

Login:

```json
{
  "email": "daniel@email.com",
  "password": "123456"
}
```

O login retorna um JWT.

---

## Tarefas

Todas as rotas abaixo exigem autenticação.

### `POST /todos`

Cria uma tarefa:

```json
{
  "title": "Estudar Jest",
  "description": "Criar testes automatizados",
  "completed": false
}
```

### `GET /todos`

Lista as tarefas do usuário autenticado.

Paginação:

```text
GET /todos?page=1&limit=10
```

Filtro de concluídas:

```text
GET /todos?completed=true
```

Filtro de pendentes:

```text
GET /todos?completed=false
```

Ordenação:

```text
GET /todos?sortBy=title&order=asc
```

### `PUT /todos/:id`

Atualiza uma tarefa:

```json
{
  "title": "Estudar Node.js",
  "description": "Revisar Express",
  "completed": true
}
```

### `DELETE /todos/:id`

Remove uma tarefa.

---

# 🧪 Testes

Os testes automatizados utilizam Jest e Supertest.

Execute:

```bash
npm test
```

Os testes cobrem cenários de:

- Cadastro
- Email duplicado
- Login válido
- Senha incorreta
- Usuário inexistente
- Ausência de token
- Token inválido
- Criação de tarefa
- Atualização de tarefa
- Exclusão de tarefa
- Tarefas inexistentes
- Autorização entre usuários
- Filtros
- Paginação
- Ordenação

---

# 🛡️ Tratamento de erros

A aplicação possui tratamento centralizado de erros.

| Código | Significado |
|---|---|
| `200` | Sucesso |
| `201` | Recurso criado |
| `204` | Recurso removido |
| `400` | Dados inválidos |
| `401` | Não autenticado |
| `404` | Recurso não encontrado |
| `409` | Conflito |

---

# 🔄 Fluxo de autenticação

```text
Cadastro
   ↓
Login
   ↓
JWT
   ↓
Authorization Header
   ↓
authMiddleware
   ↓
Controller
   ↓
Service
   ↓
Repository
   ↓
PostgreSQL
```

---

# 👥 Relacionamento

Um usuário pode possuir várias tarefas.

```text
User
 │
 │ 1:N
 ↓
Todo
```

Cada tarefa pertence a um usuário.

A API utiliza o usuário autenticado para garantir que uma tarefa só possa ser acessada pelo seu proprietário.

---

# 🎯 Objetivo

Este projeto foi desenvolvido como projeto de portfólio para demonstrar conhecimentos em desenvolvimento backend com Node.js.

Principais conceitos aplicados:

- APIs REST
- Express
- Arquitetura em camadas
- PostgreSQL
- Prisma ORM
- JWT
- bcrypt
- Zod
- Middlewares
- Tratamento de erros
- Testes automatizados
- Swagger/OpenAPI
- Git e GitHub

---

# 🚧 Próximas melhorias

- Docker
- GitHub Actions
- CI/CD
- Deploy
- Refresh Token
- Logs estruturados
- Monitoramento
- Aumento da cobertura de testes

---

# 👨‍💻 Autor

**Daniel**

GitHub:

https://github.com/Danielcbaraujo/todo-list-api

---

## 📄 Licença

Projeto desenvolvido para fins de estudo e portfólio.
