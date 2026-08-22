# 🛒 Month 2: Multi-Merchant Enterprise SaaS Platform (Shopify Clone)

Welcome to **Month 2** of the Node.js Backend Mastery Roadmap! In this 30-day intensive project, we build a production-grade **Multi-Merchant Enterprise SaaS Backend API** (Shopify Clone) powered by **PostgreSQL, Prisma ORM, Docker Compose, Zod Validation, Cloudinary, JWT Auth, Redis Caching, Socket.io WebSockets, BullMQ Background Workers, OpenAI, pgvector Semantic Search, and Automated Testing (Jest & Supertest)**.

*(Incorporating Senior Engineer Feedback & Multi-Tenant Design)*

---

## 📅 Daily Progress Tracker (Month 2: Days 01 - 30)

| Day | Topic | Theory Doc | Homework Challenge | Solution Guide | Status |
| :---: | :--- | :---: | :---: | :---: | :---: |
| **Day 01** | Intro to Databases (SQL vs NoSQL & Relational Concepts) | [Day01_IntroToDatabases.md](file:///d:/anti/month-2-Multi-Merchant-SaaS/docs/Day01_IntroToDatabases.md) | [Day01_Homework.md](file:///d:/anti/month-2-Multi-Merchant-SaaS/activities/Day01_Homework.md) | [Day01_Homework_Guide.md](file:///d:/anti/month-2-Multi-Merchant-SaaS/activities/Day01_Homework_Guide.md) | ✅ Completed |
| **Day 02** | PostgreSQL Setup, Tooling & SQL Basics | [Day02_PostgreSQL_Setup.md](file:///d:/anti/month-2-Multi-Merchant-SaaS/docs/Day02_PostgreSQL_Setup.md) | [Day02_Homework.md](file:///d:/anti/month-2-Multi-Merchant-SaaS/activities/Day02_Homework.md) | [Day02_Homework_Guide.md](file:///d:/anti/month-2-Multi-Merchant-SaaS/activities/Day02_Homework_Guide.md) | ✅ Completed |
| **Day 03** | Docker Compose (Postgres & Redis) + Prisma ORM | [Day03_Prisma_Docker.md](file:///d:/anti/month-2-Multi-Merchant-SaaS/docs/Day03_Prisma_Docker.md) | [Day03_Homework.md](file:///d:/anti/month-2-Multi-Merchant-SaaS/activities/Day03_Homework.md) | [Day03_Homework_Guide.md](file:///d:/anti/month-2-Multi-Merchant-SaaS/activities/Day03_Homework_Guide.md) | ✅ Completed |
| **Day 04** | Data Modeling 1: Users, Profiles & Roles (1:1) | [Day04_Users_Profiles_Roles.md](file:///d:/anti/month-2-Multi-Merchant-SaaS/docs/Day04_Users_Profiles_Roles.md) | [Day04_Homework.md](file:///d:/anti/month-2-Multi-Merchant-SaaS/activities/Day04_Homework.md) | [Day04_Homework_Guide.md](file:///d:/anti/month-2-Multi-Merchant-SaaS/activities/Day04_Homework_Guide.md) | ✅ Completed |
| **Day 05** | Data Modeling 2: Categories & Products (1:N) | [Day05_Categories_Products.md](file:///d:/anti/month-2-Multi-Merchant-SaaS/docs/Day05_Categories_Products.md) | [Day05_Homework.md](file:///d:/anti/month-2-Multi-Merchant-SaaS/activities/Day05_Homework.md) | [Day05_Homework_Guide.md](file:///d:/anti/month-2-Multi-Merchant-SaaS/activities/Day05_Homework_Guide.md) | ✅ Completed |
| **Day 06** | Data Modeling 3: Orders, Cart & Order Items (N:M) | [Day06_Orders_Cart.md](file:///d:/anti/month-2-Multi-Merchant-SaaS/docs/Day06_Orders_Cart.md) | [Day06_Homework.md](file:///d:/anti/month-2-Multi-Merchant-SaaS/activities/Day06_Homework.md) | [Day06_Homework_Guide.md](file:///d:/anti/month-2-Multi-Merchant-SaaS/activities/Day06_Homework_Guide.md) | ✅ Completed |
| **Day 07** | Relational Multi-Tenancy (Store/Members) & Database Seeding | [Day07_Migrations_Seeding.md](file:///d:/anti/month-2-Multi-Merchant-SaaS/docs/Day07_Migrations_Seeding.md) | [Day07_Homework.md](file:///d:/anti/month-2-Multi-Merchant-SaaS/activities/Day07_Homework.md) | [Day07_Homework_Guide.md](file:///d:/anti/month-2-Multi-Merchant-SaaS/activities/Day07_Homework_Guide.md) | ✅ Completed |
| **Day 08** | Zod Environment Validation Schema & Password Hashing | [Day08_Env_Validation_Hashing.md](file:///d:/anti/month-2-Multi-Merchant-SaaS/docs/Day08_Env_Validation_Hashing.md) | [Day08_Homework.md](file:///d:/anti/month-2-Multi-Merchant-SaaS/activities/Day08_Homework.md) | [Day08_Homework_Guide.md](file:///d:/anti/month-2-Multi-Merchant-SaaS/activities/Day08_Homework_Guide.md) | ✅ Completed |
| **Day 09** | JWT Session Auth (Access Tokens & Refresh Token Rotation) | [Day09_JWT_Auth_Rotation.md](file:///d:/anti/month-2-Multi-Merchant-SaaS/docs/Day09_JWT_Auth_Rotation.md) | [Day09_Homework.md](file:///d:/anti/month-2-Multi-Merchant-SaaS/activities/Day09_Homework.md) | [Day09_Homework_Guide.md](file:///d:/anti/month-2-Multi-Merchant-SaaS/activities/Day09_Homework_Guide.md) | ✅ Completed |
| **Day 10** | Tenant-Level Role-Based Access Control (Admin vs Owner vs Customer) | [Day10_RBAC_Authorization.md](file:///d:/anti/month-2-Multi-Merchant-SaaS/docs/Day10_RBAC_Authorization.md) | [Day10_Homework.md](file:///d:/anti/month-2-Multi-Merchant-SaaS/activities/Day10_Homework.md) | [Day10_Homework_Guide.md](file:///d:/anti/month-2-Multi-Merchant-SaaS/activities/Day10_Homework_Guide.md) | ✅ Completed |
| **Day 11** | Store & Product Management CRUD APIs | [Day11_Store_Product_CRUD.md](file:///d:/anti/month-2-Multi-Merchant-SaaS/docs/Day11_Store_Product_CRUD.md) | N/A | N/A | ✅ Completed |
| **Day 12** | Advanced Filtering & Category Tree Queries (Pagination) | [Day12_Filtering_Pagination.md](file:///d:/anti/month-2-Multi-Merchant-SaaS/docs/Day12_Filtering_Pagination.md) | N/A | N/A | ✅ Completed |
| **Day 13** | Cloud Image Uploads for Store Products (Multer + Cloudinary SDK) | [Day13_Cloudinary_Multer_Uploads.md](file:///d:/anti/month-2-Multi-Merchant-SaaS/docs/Day13_Cloudinary_Multer_Uploads.md) | N/A | N/A | ✅ Completed |
| **Day 14** | Multi-Tenant Shopping Cart Management API | Pending | Pending | Pending | ⏳ Pending |
| **Day 15** | Order Checkout API & Prisma Transactions (Atomic Stock Decrement) | Pending | Pending | Pending | ⏳ Pending |
| **Day 16** | Order Status Workflow (Pending -> Delivered) | Pending | Pending | Pending | ⏳ Pending |
| **Day 17** | Payment Gateway Integration & Webhook Handling (Stripe simulation) | Pending | Pending | Pending | ⏳ Pending |
| **Day 18** | Customer Account & Order History Endpoints | Pending | Pending | Pending | ⏳ Pending |
| **Day 19** | Security Hardening (Rate limiting, Helmet security headers, CORS) | Pending | Pending | Pending | ⏳ Pending |
| **Day 20** | Centralized Error Handling & Logging | Pending | Pending | Pending | ⏳ Pending |
| **Day 21** | API Documentation with Swagger UI & Postman Collection Export | Pending | Pending | Pending | ⏳ Pending |
| **Day 22** | Intro to Redis in Docker & High-Performance Caching | Pending | Pending | Pending | ⏳ Pending |
| **Day 23** | Implementing Redis Caching for Product Catalog | Pending | Pending | Pending | ⏳ Pending |
| **Day 24** | Cache Invalidation Patterns (Evicting Redis cache) | Pending | Pending | Pending | ⏳ Pending |
| **Day 25** | Automated Testing Part 1: Unit Testing with Jest | Pending | Pending | Pending | ⏳ Pending |
| **Day 26** | Automated Testing Part 2: Integration Testing (Supertest) | Pending | Pending | Pending | ⏳ Pending |
| **Day 27** | Database Indexing & Query Optimization | Pending | Pending | Pending | ⏳ Pending |
| **Day 28** | Rate Limiting & Redis-backed API Throttling | Pending | Pending | Pending | ⏳ Pending |
| **Day 29** | Production Build Optimization & Environment Hardening | Pending | Pending | Pending | ⏳ Pending |
| **Day 30** | Final Code Review, Architecture Docs & GitHub Release | Pending | Pending | Pending | ⏳ Pending |

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. API Healthcheck
Verify your server is running by sending a GET request to:
`http://localhost:5000/api/v1/health`
