# Month 2 Day 03 Homework: Docker & Prisma ORM Initiation 🐳

## 🎯 Task Objective
Verify that you can launch containerized database services using Docker Compose, check their status, and generate your Prisma Client library.

---

## 📝 Challenge Requirements

### Part 1: Docker Compose Launch
1. Ensure Docker Desktop is running on your PC.
2. Open your terminal in `month-2-E-commerce/` and start the containers in detached (background) mode.
3. Verify that both database servers are running using the correct Docker CLI command.

---

### Part 2: Connect to Containerized PostgreSQL
Verify that your database GUI tool (DBeaver / pgAdmin) or your healthcheck API (`http://localhost:5000/api/v1/health`) can connect to the new Docker PostgreSQL instance using:
- Host: `localhost`
- Port: `5432`
- User: `postgres`
- Password: `postgres`
- Database: `ecommerce_db`

---

### Part 3: Generate Prisma Client
Run the Prisma generator command to build the type-safe client library on your machine.

---

## 📥 Solution Verification
Check your commands and CLI output formatting against [Day03_Homework_Guide.md](file:///d:/anti/month-2-E-commerce/activities/Day03_Homework_Guide.md)!
