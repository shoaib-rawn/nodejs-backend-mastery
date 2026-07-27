# Day 03 Homework Guide: Docker & Prisma ORM Solutions 🐳

This guide outlines the commands and verification steps to initialize your Docker containers and generate Prisma client files.

---

## 🚀 1. Part 1: Start Docker Containers

Navigate to `month-2-E-commerce/` in your terminal and run:

```bash
docker compose up -d
```

### Verification Command:
```bash
docker ps
```

```text
================================================================================================
                                 ACTIVE DOCKER CONTAINERS
================================================================================================
  CONTAINER ID | IMAGE               | STATUS      | PORTS                  | NAMES
---------------+---------------------+-------------+------------------------+-------------------
  8a1b2c3d4e5f | postgres:16-alpine  | Up 2 mins   | 0.0.0.0:5432->5432/tcp | ecom_postgres
  9f8e7d6c5b4a | redis:7-alpine      | Up 2 mins   | 0.0.0.0:6379->6379/tcp | ecom_redis
================================================================================================
```

---

## 🗄️ 2. Part 2: Verify Database Connection

Your `.env` file should have the matching database url:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ecommerce_db?schema=public"
```

When you start the Express API using `npm run dev` and request `http://localhost:5000/api/v1/health`, the server should confirm healthy connectivity:

```text
================================================================================================
                              GET /api/v1/health RESPONSE
================================================================================================
  Status Code  | 200 OK
  JSON Body    | {
               |   "status": "success",
               |   "message": "E-Commerce API Service and PostgreSQL are running!",
               |   "database": {
               |     "isConnected": true
               |   }
               | }
================================================================================================
```

---

## 💎 3. Part 3: Generate Prisma Client

To compile the `schema.prisma` file into local TypeScript database models, run:

```bash
npx prisma generate
```

This updates your `@prisma/client` package. You can now use type-safe database models inside `src/config/prisma.config.ts` like this:

```typescript
import { PrismaClient } from '@prisma/client';
export const prisma = new PrismaClient();
```
