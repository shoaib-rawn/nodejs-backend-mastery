# Month 2 Day 03: Docker Compose Setup & Prisma ORM Basics

## 📌 Executive Summary
On Day 02, we installed PostgreSQL locally. Today on **Day 03**, we step up to professional containerized development by setting up **Docker Compose** to manage our local **PostgreSQL** and **Redis** database servers. We also initialize **Prisma ORM**, configure our datasource, and establish a single Prisma Client instance for the application.

---

## 1. Why Docker & Docker Compose?

In professional backend development, installing databases directly on your host operating system is discouraged because:
- **Environment Drift:** Different developers might have different versions of PostgreSQL installed.
- **Port Clashes:** Hard to manage multiple database versions running simultaneously.
- **Installation Friction:** Installing database servers on macOS, Linux, and Windows has different steps.

### 🐳 What is Docker?
Docker wraps software in a lightweight, isolated container including all dependencies needed to run it.

### 💽 What is a Docker Image?
A **Docker Image** is a read-only template containing the operating system, system libraries, and application settings required to run a specific software (like a pre-packaged installer or blueprint).
- **Postgres Image (`postgres:16-alpine`):** Contains the PostgreSQL engine compiled on a minimal Alpine Linux distribution.
- **Redis Image (`redis:7-alpine`):** Contains the Redis database engine compiled on Alpine Linux.

### 📄 What is Docker Compose?
Docker Compose is a tool to define and run multi-container applications. Using a single `docker-compose.yml` file, you can configure your entire stack and start it with one command:
```bash
docker compose up -d
```

---

## 2. What is Redis and Why Do We Use It? 🏎️

### ❓ What is Redis?
Redis (Remote Dictionary Server) is an open-source, **in-memory** key-value data structure store. Unlike PostgreSQL which writes data to hard drives (SSD/HDD), Redis stores everything directly inside the computer's **RAM (Random Access Memory)**.

### 🎯 Why Do We Use Redis?
1. **Sub-Millisecond Speed:** Because RAM is hundreds of times faster than storage disks, Redis reads and writes data in microseconds.
2. **Caching (Week 4):** Reduces database load. Instead of querying PostgreSQL 1,000 times for the same product catalog page, we fetch the catalog once, save it in Redis, and serve it instantly from RAM.
3. **Session & Token Storage:** Excellent for storing active user sessions or blacklisted JWT tokens.
4. **Rate Limiting:** Protects our API from brute-force attacks by tracking request limits at lightning speeds.

---

## 3. Our Docker Compose Architecture

Our `docker-compose.yml` configures two isolated services:

```text
================================================================================================
  Service        | Container Name   | Image             | Internal Port | Host Port Mapping
-----------------+------------------+-------------------+---------------+-----------------------
  postgres       | ecom_postgres    | postgres:16-alpine| 5432          | 5432:5432
  redis          | ecom_redis       | redis:7-alpine    | 6379          | 6379:6379
================================================================================================
```

Both containers use persistent **Docker Volumes** (`pgdata` and `redisdata`) to ensure your database entries and cache keys are NOT deleted when container processes restart.

---

## 4. What is an ORM (Object-Relational Mapper)?

An **ORM** maps SQL database tables directly into objects in your programming language. 

```text
  Raw SQL Query (Day 02)                   Prisma ORM Method (Day 03)
==========================               ==============================
  SELECT * FROM products;       ====>     await prisma.product.findMany()
```

### 💎 Why we use Prisma ORM:
1. **Type Safety:** Auto-generates TypeScript interfaces for all your tables.
2. **Autocompletion:** VS Code will show auto-complete options when writing queries.
3. **Automated Migrations:** Track changes in your schemas and apply them seamlessly to production.

---

## 5. How is Prisma Initialized? (`npx prisma init`)

When setting up a new project, running the CLI command:
```bash
npx prisma init
```
automatically generates the folder structures for you:
1. **Creates `prisma/` folder** at the root level of your project.
2. **Creates `prisma/schema.prisma`** file containing the provider configurations.
3. **Creates / Updates `.env`** with the default connection URL placeholder.

---

## 6. What Files are Generated? (`npx prisma generate`)

When you run `npx prisma generate`, Prisma compiles your schema and writes the generated library files into **`node_modules/.prisma/client/`**:

```text
node_modules/.prisma/client/
├── 📄 index.d.ts                    <-- 1. Generated TypeScript types (e.g. User, Product shapes)
├── 📄 index.js                      <-- 2. Main JavaScript client runtime
├── 📄 query_engine-windows.dll.node <-- 3. Compiled Rust Query Engine (handles database queries)
└── 📄 schema.prisma                 <-- 4. Copy of your schema configuration
```

- **TypeScript Definitions (`index.d.ts`):** Defines the models, inputs, outputs, and autocomplete interfaces that VS Code reads to help you write query code.
- **Rust Query Engine (`query_engine-*.node`):** A high-performance database execution engine compiled in Rust that runs in the background to convert your JS queries to raw SQL statements.

---

## 7. Prisma Config & Singleton Pattern (`prisma.config.ts`)
To prevent Node.js from opening a new database connection pool on every file import, we create and export a single shared instance:
```typescript
import { PrismaClient } from '@prisma/client';
export const prisma = new PrismaClient();
```

---

## 🛠️ 8. Today's Project Implementation Changes

Here is a summary of the code and configuration files we added to the project today:

### 1. `docker-compose.yml` (Created)
- Defines the local database ecosystem containing `postgres` (port 5432) and `redis` (port 6379).
- Reuses `.env` parameters (`${DB_USER}`, `${DB_PASSWORD}`) so no credentials are hardcoded.

### 2. `prisma/schema.prisma` (Created)
- Configures Prisma to connect to the PostgreSQL container using the `DATABASE_URL` environment variable.
- Declares a test `User` model to verify the client compilation.

### 3. `src/config/prisma.config.ts` (Created)
- Exports a unified `prisma` client instance (Singleton pattern) so all route files share a single connection pool.

### 4. `.env` (Modified)
- Updated with literal database credentials and unified `DATABASE_URL` format.

---

## 💡 Summary Checklist
- [x] Create a `docker-compose.yml` file configuring PostgreSQL & Redis.
- [x] Configure volumes for data persistence.
- [x] Create a `schema.prisma` file containing datasource connection configurations.
- [x] Implement the Prisma Client singleton in `src/config/prisma.config.ts`.
- [x] Compile the client binaries using `npx prisma generate`.
