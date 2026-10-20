# Delivery Tracker — Exercício do Capítulo 5

> **Programação Web II — IFAL/Maceió.** O projeto evolui do Cap. 4 para persistência real com Prisma ORM sobre SQLite, mantendo o contrato da API e as regras de negócio.

## Como usar este repositório

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Crie o `.env` a partir do exemplo:
   ```bash
   cp .env.example .env
   ```
3. Gere o Prisma Client e aplique a migration:
   ```bash
   npx prisma generate
   npx prisma migrate deploy
   ```
4. Rode a API:
   ```bash
   npm start
   ```

Para desenvolvimento local com criação/atualização de migrations:
```bash
npx prisma migrate dev
```

Para inspecionar os dados:
```bash
npx prisma studio
```

## Arquitetura

```
HTTP
  ↓
Routes / Composition Root
  ↓
Controllers
  ↓
Services
  ↓
Repositories Prisma
  ↓
Prisma Client (singleton)
  ↓
SQLite
```

Os Services e Controllers mantêm as regras e o contrato da API. O acesso ao Prisma fica restrito aos Repositories, e a composição das dependências continua em `src/routes`.

## Contrato

- Base `/api` · JSON · erro `{ "erro": "..." }` · `GET /api/health` → `{ "status": "ok" }`.
- Status: `201` criar · `400` entrada inválida · `404` não encontrado · `409` unicidade (duplicata/CPF) · `422` regra de estado.
- Execução: `npm start`, respeita `process.env.PORT`, branch `main`.
- Banco: `DATABASE_URL="file:./dev.db"`.

## Persistência

O schema está em `prisma/schema.prisma` e a migration inicial em `prisma/migrations/`. O arquivo `prisma/dev.db` é gerado localmente e não deve ser versionado.
