require("dotenv").config({ path: ".env" });

const request = require("supertest");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const app = require("../src/app");
const { initializeDatabase } = require("../src/database");
const User = require("../src/sql/User");
const Car = require("../src/nosql/Car");
const Moto = require("../src/nosql/Moto");
const ClothingBrand = require("../src/nosql/ClothingBrand");

const unique = Date.now();

let token;
let adminToken;
let userId;
let adminId;
let carId;
let motoId;
let brandId;

beforeAll(async () => {
    process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret-key";
    await initializeDatabase(30);
}, 120000);

beforeEach(async () => {
    await User.destroy({ where: {}, truncate: true });
    await Car.deleteMany({});
    await Moto.deleteMany({});
    await ClothingBrand.deleteMany({});

    const passwordHash = await bcrypt.hash("senha123", 10);

    const user = await User.create({
        name: "Usuário Teste",
        email: `user-${unique}@test.com`,
        password: passwordHash,
        role: "user"
    });

    const admin = await User.create({
        name: "Admin Teste",
        email: `admin-${unique}@test.com`,
        password: passwordHash,
        role: "admin"
    });

    userId = user.id;
    adminId = admin.id;

    const loginResponse = await request(app)
        .post("/users/login")
        .send({ email: user.email, password: "senha123" });

    token = loginResponse.body.token;

    const adminLogin = await request(app)
        .post("/users/login")
        .send({ email: admin.email, password: "senha123" });

    adminToken = adminLogin.body.token;
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe("Usuários", () => {
    test("cria usuário com sucesso", async () => {
        const response = await request(app)
            .post("/users")
            .send({
                name: "Novo Usuário",
                email: `novo-${unique}@test.com`,
                password: "senha123"
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
        expect(response.body.email).toBe(`novo-${unique}@test.com`);
        expect(response.body).not.toHaveProperty("password");
    });

    test("lista usuários autenticado", async () => {
        const response = await request(app)
            .get("/users")
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
    });

    test("busca usuário por ID", async () => {
        const response = await request(app)
            .get(`/users/${userId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.id).toBe(userId);
        expect(response.body).not.toHaveProperty("password");
    });

    test("atualiza usuário próprio", async () => {
        const response = await request(app)
            .put(`/users/${userId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ name: "Nome Atualizado" });

        expect(response.status).toBe(200);
        expect(response.body.name).toBe("Nome Atualizado");
    });

    test("exclui usuário como admin", async () => {
        const response = await request(app)
            .delete(`/users/${userId}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(response.status).toBe(204);
    });

    test("retorna 403 ao excluir sem permissão de admin", async () => {
        const response = await request(app)
            .delete(`/users/${adminId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(403);
        expect(response.body.message).toBe("Acesso negado");
    });

    test("retorna 401 sem token em rota protegida", async () => {
        const response = await request(app).get("/users");

        expect(response.status).toBe(401);
    });
});

describe("Login", () => {
    test("autenticação válida", async () => {
        const response = await request(app)
            .post("/users/login")
            .send({
                email: `user-${unique}@test.com`,
                password: "senha123"
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("token");
    });

    test("autenticação inválida", async () => {
        const response = await request(app)
            .post("/users/login")
            .send({
                email: `user-${unique}@test.com`,
                password: "senhaerrada"
            });

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Credenciais inválidas");
    });
});

describe("Carros", () => {
    test("CRUD completo de carros", async () => {
        const create = await request(app)
            .post("/cars")
            .set("Authorization", `Bearer ${token}`)
            .send({ model: "Corolla", year: 2024 });

        expect(create.status).toBe(201);
        expect(create.body.model).toBe("Corolla");
        carId = create.body._id;

        const list = await request(app)
            .get("/cars")
            .set("Authorization", `Bearer ${token}`);

        expect(list.status).toBe(200);
        expect(list.body.length).toBe(1);

        const find = await request(app)
            .get(`/cars/${carId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(find.status).toBe(200);
        expect(find.body._id).toBe(carId);

        const update = await request(app)
            .put(`/cars/${carId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ model: "Civic", year: 2025 });

        expect(update.status).toBe(200);
        expect(update.body.model).toBe("Civic");

        const remove = await request(app)
            .delete(`/cars/${carId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(remove.status).toBe(204);
    });

    test("retorna 401 sem token", async () => {
        const response = await request(app).get("/cars");
        expect(response.status).toBe(401);
    });
});

describe("Motos", () => {
    test("CRUD completo de motos", async () => {
        const create = await request(app)
            .post("/motos")
            .set("Authorization", `Bearer ${token}`)
            .send({ model: "CB500", year: 2023 });

        expect(create.status).toBe(201);
        motoId = create.body._id;

        const list = await request(app)
            .get("/motos")
            .set("Authorization", `Bearer ${token}`);

        expect(list.status).toBe(200);

        const find = await request(app)
            .get(`/motos/${motoId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(find.status).toBe(200);

        const update = await request(app)
            .put(`/motos/${motoId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ model: "MT-07", year: 2024 });

        expect(update.status).toBe(200);
        expect(update.body.model).toBe("MT-07");

        const remove = await request(app)
            .delete(`/motos/${motoId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(remove.status).toBe(204);
    });
});

describe("Marcas de roupa", () => {
    test("CRUD completo de marcas", async () => {
        const create = await request(app)
            .post("/brands")
            .set("Authorization", `Bearer ${token}`)
            .send({ name: "Nike", country: "EUA" });

        expect(create.status).toBe(201);
        brandId = create.body._id;

        const list = await request(app)
            .get("/brands")
            .set("Authorization", `Bearer ${token}`);

        expect(list.status).toBe(200);

        const find = await request(app)
            .get(`/brands/${brandId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(find.status).toBe(200);

        const update = await request(app)
            .put(`/brands/${brandId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ name: "Adidas", country: "Alemanha" });

        expect(update.status).toBe(200);
        expect(update.body.name).toBe("Adidas");

        const remove = await request(app)
            .delete(`/brands/${brandId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(remove.status).toBe(204);
    });
});

describe("Swagger", () => {
    test("documentação disponível", async () => {
        const response = await request(app).get("/api-docs.json");
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("openapi");
        expect(response.body.paths).toBeDefined();
    });
});
