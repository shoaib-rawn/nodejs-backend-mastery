# 🛒 Month 2 Roadmap: Pure Backend E-Commerce REST API (30 Days)

Welcome to **Month 2**! In this 30-day intensive project, you will build an enterprise-grade, production-ready **E-Commerce Backend REST API** powered by **Node.js, Express, PostgreSQL, Prisma ORM, Redis Caching, JWT Authentication, and Automated Testing (Jest & Supertest)**.

---

## 📅 30-Day Pure Backend Engineering Breakdown

### 🔴 Week 1: Relational Databases & Schema Modeling (Days 01 - 07)
- **Day 01:** Intro to Relational Databases (SQL vs NoSQL, RDBMS, ACID compliance).
- **Day 02:** PostgreSQL Installation, Database Tools (DBeaver/pgAdmin) & Connection setup.
- **Day 03:** Prisma ORM Setup & `schema.prisma` configuration.
- **Day 04:** Relational Data Modeling Part 1: Users, Profiles & Roles (1:1 relationships).
- **Day 05:** Relational Data Modeling Part 2: Categories & Products (1:N relationships).
- **Day 06:** Relational Data Modeling Part 3: Orders, Cart & Order Items (N:M junction tables).
- **Day 07:** Database Migrations & Automated Seeding Scripts with realistic catalog data.

---

### 🟡 Week 2: Auth, RBAC & Product Catalog API (Days 08 - 14)
- **Day 08:** User Registration & Password Hashing with `bcryptjs`.
- **Day 09:** Authentication with JWT (Access Tokens + Refresh Token rotation).
- **Day 10:** Role-Based Access Control (RBAC middleware: Admin vs Customer).
- **Day 11:** Product Management API (CRUD endpoints for products & categories).
- **Day 12:** Search, Filtering, Sorting & Pagination API (by price range, category, search text).
- **Day 13:** Image Uploads for Products (`Multer` middleware & file handling).
- **Day 14:** Shopping Cart Management API (Add, update quantity, remove, cart total).

---

### 🟢 Week 3: Orders, Transactions & Payment Webhooks (Days 15 - 21)
- **Day 15:** Order Checkout API & Prisma Transactions (Atomic stock decrements).
- **Day 16:** Order Status Workflow (Pending, Processing, Shipped, Delivered, Cancelled).
- **Day 17:** Payment Gateway Integration & Webhook Handling (Stripe simulation).
- **Day 18:** Customer Account & Order History Endpoints.
- **Day 19:** Security Hardening (Rate limiting, Helmet security headers, CORS, Input validation with Zod).
- **Day 20:** Centralized Error Handling & Logging (Custom AppError, Morgan logger).
- **Day 21:** API Documentation with Swagger UI & Postman Collection Export.

---

### 🔵 Week 4: Advanced Backend Engineering & Production Hardening (Days 22 - 30)
- **Day 22:** Intro to Redis & High-Performance Caching Strategies.
- **Day 23:** Implementing Redis Caching for Product Catalog & Categories.
- **Day 24:** Cache Invalidation Patterns (Evicting Redis cache on Product mutations).
- **Day 25:** Automated Testing Part 1: Unit Testing API Controllers & Services with Jest.
- **Day 26:** Automated Testing Part 2: Integration Testing Express Routes with Supertest.
- **Day 27:** Database Indexing & Query Performance Optimization in PostgreSQL.
- **Day 28:** Rate Limiting & Redis-backed API Throttling.
- **Day 29:** Production Build Optimization & Environment Hardening.
- **Day 30:** Final Code Review, Architecture Documentation & GitHub Portfolio Release.
