# Atividade API

API REST desenvolvida em Node.js e Express para demonstrar persistência híbrida (SQL + NoSQL), autenticação JWT, autorização por papéis, segurança OWASP, testes automatizados, conteinerização Docker e documentação Swagger.

## Arquitetura

A aplicação segue uma arquitetura em camadas modular: rotas (`src/routes`), controllers (`src/controllers`), modelos SQL (`src/sql`) e NoSQL (`src/nosql`), middlewares (`src/middlewares`) e configurações (`src/config`). O Express centraliza o roteamento em `src/app.js`, enquanto `src/server.js` inicializa conexões e sobe o servidor.

## Tecnologias

- **Node.js + Express** — servidor HTTP e roteamento
- **MySQL + Sequelize** — persistência relacional de usuários
- **MongoDB + Mongoose** — persistência de carros, motos e marcas de roupa
- **JWT + bcryptjs** — autenticação e hash de senhas
- **Helmet, CORS, express-validator, express-mongo-sanitize** — segurança
- **Jest + Supertest** — testes de integração
- **Swagger (swagger-jsdoc + swagger-ui-express)** — documentação automática
- **Docker + Docker Compose** — orquestração de serviços

## SQL e NoSQL simultâneos

Usuários são armazenados exclusivamente no MySQL (dados estruturados com integridade relacional). Carros, motos e marcas de roupa utilizam MongoDB (documentos flexíveis). Cada contexto possui modelos e controllers dedicados, compartilhando apenas a camada HTTP e autenticação.

## Autenticação e autorização

O endpoint `POST /users/login` valida credenciais e emite JWT assinado com `JWT_SECRET`. Rotas protegidas exigem header `Authorization: Bearer <token>`. Requisições sem token ou com token inválido retornam **401**. Exclusão de usuários exige papel `admin`; demais usuários recebem **403**.

## Segurança (OWASP)

| Medida | Mitigação |
|--------|-----------|
| Helmet | Reduz headers inseguros e ataques comuns (XSS, clickjacking) |
| CORS configurável | Restringe origens autorizadas |
| express-validator | Valida entradas e previne dados malformados |
| express-mongo-sanitize | Evita injeção NoSQL em operadores MongoDB |
| bcrypt | Impede exposição de senhas em texto puro |
| JWT em variável de ambiente | Protege segredo de assinatura |
| Error handler centralizado | Oculta stack traces em produção |
| Exclusão de senha nas respostas | Previne vazamento de credenciais |

## Docker

Fluxo principal de execução:

```bash
cp .env.example .env
docker compose up --build
```

A API ficará disponível em `http://localhost:3000` e a documentação Swagger em `http://localhost:3000/api-docs`.

## Testes

Com os containers em execução:

```bash
docker compose exec api npm test
```

Os testes cobrem CRUD de todos os recursos, login, autenticação de rotas protegidas, cenários 401/403/404 e validação da documentação Swagger.

## Organização do projeto

```
src/
  app.js              # Configuração Express
  server.js           # Bootstrap do servidor
  database.js         # Inicialização dos bancos
  config/             # MySQL, MongoDB, Swagger
  controllers/        # Lógica de negócio
  middlewares/        # Auth, autorização, erros, validação
  nosql/              # Modelos Mongoose
  routes/             # Rotas e anotações Swagger
  sql/                # Modelos Sequelize
  validators/         # Regras express-validator
tests/                # Testes de integração
```

## Principais decisões arquiteturais

- MySQL foi mantido (em vez de PostgreSQL) para reutilizar a implementação existente com Sequelize, atendendo ao requisito de banco relacional.
- Autorização por papéis (`user` / `admin`) demonstra HTTP 403 em exclusão de usuários.
- Inicialização de bancos com retry garante startup confiável via Docker Compose.
- Swagger documenta todos os endpoints com esquema Bearer JWT.
