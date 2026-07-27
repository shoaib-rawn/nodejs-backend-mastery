# 🛒 Month 2 Roadmap: Enterprise Backend E-Commerce REST API (30 Days)

Welcome to **Month 2**! In this 30-day intensive project, you will build an enterprise-grade, production-ready **E-Commerce Backend REST API** powered by **Node.js, Express, PostgreSQL, Prisma ORM, Redis Caching, Docker Compose, Zod Validation, Cloudinary File Uploads, JWT Auth, and Automated Testing (Jest & Supertest)**.

*(Incorporating Senior Engineer Best Practices)*

---

## 📅 30-Day Pure Backend Engineering Breakdown

### 🔴 Week 1: Relational Databases, Docker & Schema Modeling (Days 01 - 07)
- **Day 01:** Intro to Relational Databases (SQL vs NoSQL, RDBMS, ACID compliance).
- **Day 02:** PostgreSQL Setup, Database Tools (DBeaver/pgAdmin) & SQL Basics.
- **Day 03:** **Docker Compose Setup (`docker-compose.yml` for PostgreSQL & Redis)** & Prisma ORM Setup.
- **Day 04:** Relational Data Modeling Part 1: Users, Profiles & Roles (1:1 relationships).
- **Day 05:** Relational Data Modeling Part 2: Categories & Products (1:N relationships).
- **Day 06:** Relational Data Modeling Part 3: Orders, Cart & Order Items (N:M junction tables).
- **Day 07:** Database Migrations & Automated Seeding Scripts with realistic catalog data.

---

### 🟡 Week 2: Environment Validation, Zod, Auth & Product API (Days 08 - 14)
- **Day 08:** **Strict `.env` Environment Variable Validation with Zod** & User Password Hashing (`bcryptjs`).
- **Day 09:** Authentication with JWT (Access Tokens + Refresh Token rotation).
- **Day 10:** Role-Based Access Control (RBAC middleware: Admin vs Customer).
- **Day 11:** **Early Request Validation with Zod Schemas** & Product Management API (CRUD).
- **Day 12:** Search, Filtering, Sorting & Pagination API (by price range, category, search text).
- **Day 13:** **Production Image Uploads to Cloudinary** (Multer + Cloudinary SDK).
- **Day 14:** Shopping Cart Management API (Add, update quantity, remove, cart total).

---

### 🟢 Week 3: Orders, Transactions & Payment Webhooks (Days 15 - 21)
- **Day 15:** Order Checkout API & Prisma Transactions (Atomic stock decrements).
- **Day 16:** Order Status Workflow (Pending, Processing, Shipped, Delivered, Cancelled).
- **Day 17:** Payment Gateway Integration & Webhook Handling (Stripe simulation).
- **Day 18:** Customer Account & Order History Endpoints.
- **Day 19:** Security Hardening (Rate limiting, Helmet security headers, CORS).
- **Day 20:** Centralized Error Handling & Logging (Custom AppError, Morgan logger).
- **Day 21:** API Documentation with Swagger UI & Postman Collection Export.

---

### 🔵 Week 4: Advanced Backend Engineering & Production Hardening (Days 22 - 30)
- **Day 22:** Intro to Redis in Docker & High-Performance Caching Strategies.
- **Day 23:** Implementing Redis Caching for Product Catalog & Categories.
- **Day 24:** Cache Invalidation Patterns (Evicting Redis cache on Product mutations).
- **Day 25:** Automated Testing Part 1: Unit Testing API Controllers & Services with Jest.
- **Day 26:** Automated Testing Part 2: Integration Testing Express Routes with Supertest.
- **Day 27:** Database Indexing & Query Performance Optimization in PostgreSQL.
- **Day 28:** Rate Limiting & Redis-backed API Throttling.
- **Day 29:** Production Build Optimization & Environment Hardening.
- **Day 30:** Final Code Review, Architecture Documentation & GitHub Portfolio Release.



🟡 Month 1: Project 1 - Task Manager API
Yellow Tabs Covered: Internet Basics, OS/General, Git (Git Flow), Node.js, APIs (REST/JSON), TypeScript Basics. Goal: Learn how APIs work, establish Git best practices, and build a structured REST API.

Week 1: Server Setup, Express Routing, HTTP Methods (GET, POST), Setup Git Flow (create dev branch).
Week 2: Middleware, Centralized Error Handling, Postman, TypeScript Setup, Feature Branching (no direct pushes to main/dev).
Week 3: Deep dive into RESTful principles, Input Validation (Zod), Pull Request Flow (Mock PR reviews).
Week 4: Advanced Routing, Environment Variables, Helmet + Rate-limiting, Project Polish.
🟡 Month 2: Project 2 - E-Commerce API
Yellow Tabs Covered: PostgreSQL, Prisma ORM, Web Security, HTTPS, Relational Database Modeling. Goal: Master relational databases, complex data modeling, and web security.

Week 5: Intro to Databases (SQL vs NoSQL), PostgreSQL setup, Relational Pacing (foreign keys, joins).
Week 6: Prisma ORM, Migrations, E-Commerce Data Modeling (Users ➔ Products ➔ Orders relationships, One-to-Many & Many-to-Many).
Week 7: Web Security Basics, CORS, Password Hashing (bcrypt), JWT Access Tokens + Refresh Tokens.
Week 8: Protected Routes, File Uploads (Images), Security hardening.
🟡 Month 3: Project 3 - Real-Time Chat API (Slack Clone)
Yellow Tabs Covered: Docker, WebSockets (Socket.io), MongoDB (NoSQL), Redis, Testing (Jest). Goal: Build a high-performance, real-time containerized chat application.

Week 9: Docker Setup (Containerize MongoDB & Redis immediately), Real-time WebSockets with Socket.io.
Week 10: MongoDB Atlas, Mongoose Schemas, Chat History storage (NoSQL document model scalability).
Week 11: Introduction to Caching, Add Redis rate-limiting & caching to API.
Week 12: Automated Testing (Jest), production bundle optimization, deployment.
🟣 Month 4: Project 4 - Parcel Tracking System API
Technologies Covered: Advanced WebSockets, Webhooks, Role-Based Access Control (RBAC), Geographic Data (PostGIS/MongoDB Geospatial). Goal: Build a real-time logistics tracking system (like TCS, FedEx, or Amazon Logistics) with live package updates and geographic tracking.

Week 13: Advanced Database Relations (Couriers, Vehicles, Hubs, Parcels), generating Tracking Numbers.
Week 14: Event-Driven Architecture, Webhooks for status events ("Dispatched", "In Transit", "Delivered").
Week 15: Role-Based Access Control (Admin Dashboard, Courier App, Customer View), Barcode/QR Code generation.
Week 16: Real-Time Live Location updates using WebSockets and Geographic Data queries, Final Polish.