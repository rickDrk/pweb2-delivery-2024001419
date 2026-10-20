# Delivery Tracker — Exercício do Capítulo 4

> **Programação Web II — IFAL/Maceió.** Este é o **projeto do semestre** (avaliado). No Cap. 4 você
> inicia a **Delivery Tracker API** com **arquitetura em camadas** e, depois, **Repository Pattern +
> injeção de dependência**. A correção é **automática** (autograder de conformidade) + arquitetura.

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
## Duas etapas (ver os enunciados completos)

- **Atividade 05 — Entregas em camadas:** CRUD de `/api/entregas`, ciclo de status
  (`CRIADA → EM_TRANSITO → ENTREGUE`/`CANCELADA`), histórico. Meta: checagens de **Entregas** verdes.
- **Atividade 06 — Motoristas + Contratos + DI:** `/api/motoristas`, atribuição de motorista,
  contratos de repository (JSDoc) e composição num ponto único. Meta: **122/122**.

> O critério de **inversão de dependência** é verificado pelo professor **trocando o repository por
> um Mock** que respeita o contrato — programe contra o contrato desde o início.

## Contrato (resumo)

- Base `/api` · JSON · erro `{ "erro": "..." }` · `GET /api/health` → `{ "status": "ok" }`.
- Status: `201` criar · `400` entrada inválida · `404` não encontrado · `409` unicidade
  (duplicata/CPF) · `422` regra de estado (transição/atribuição inválida).
- Execução: `npm start`, respeita `process.env.PORT`, branch `main`.

## Persistência

O schema está em `prisma/schema.prisma` e a migration inicial em `prisma/migrations/`. O arquivo `prisma/dev.db` é gerado localmente e não deve ser versionado.