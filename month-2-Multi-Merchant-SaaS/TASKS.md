# 🛒 Tasks: Month 2 - Enterprise Multi-Merchant SaaS Platform (Days 01 - 30 Backend + Next.js Frontend)

> **Backend Stack:** Node.js, Express, PostgreSQL, Prisma ORM, Redis, Zod, Cloudinary, JWT Auth (RTR), Jest & Supertest.  
> **Frontend Stack:** Next.js (App Router), Tailwind CSS, Shadcn UI, React Hook Form, Zod, TanStack Query, Axios, Lucide Icons, Vercel.

---

## 🔴 Week 1: Relational Database Modeling, Docker & Core Setup
- [x] **Day 01:** Intro to Relational Databases (SQL vs NoSQL, ACID Compliance)
- [x] **Day 02:** PostgreSQL Setup, pgAdmin & DBeaver SQL Syntax
- [x] **Day 03:** Docker Compose Setup (PostgreSQL & Redis) + Prisma ORM Initialization
- [x] **Day 04:** Data Modeling Part 1: Users, Profiles & Roles (1:1 Relations)
- [x] **Day 05:** Data Modeling Part 2: Stores, Categories & Products (1:N Relations)
- [x] **Day 06:** Data Modeling Part 3: Cart Items, Store Members & Orders (N:M Junction Tables)
- [x] **Day 07:** Database Migrations & Automated Multi-Tenant Seeding Script

---

## 🟡 Week 2: Environment Validation, Zod, Auth & Product API
- [x] **Day 08:** Strict `.env` Zod Validation Schema & Password Hashing (`bcryptjs`)
- [x] **Day 09:** JWT Authentication (Access Token + Refresh Token Rotation in HttpOnly Cookie)
- [x] **Day 10:** Multi-Tenant Role-Based Access Control (Platform `ADMIN` vs Store `OWNER`/`STAFF`)
- [x] **Day 11:** Zod Early Request Validation & Store/Product Management CRUD APIs
- [ ] **Day 12:** Product Search, Filtering, Sorting & Pagination API
- [ ] **Day 13:** Production Cloud Image Uploads (Cloudinary SDK + Multer)
- [ ] **Day 14:** Shopping Cart Management API

---

## 🟢 Week 3: Orders, Transactions & Payment Webhooks
- [ ] **Day 15:** Order Checkout API & Prisma Transactions (Atomic Stock Decrements)
- [ ] **Day 16:** Order Status Workflow (Pending ➔ Processing ➔ Shipped ➔ Delivered)
- [ ] **Day 17:** Payment Gateway Integration & Webhook Handling (Stripe simulation)
- [ ] **Day 18:** Customer Account & Order History Endpoints
- [ ] **Day 19:** Security Hardening (Rate limiting, Helmet security headers, CORS)
- [ ] **Day 20:** Centralized Error Handling & Logging (Custom AppError, Morgan logger)
- [ ] **Day 21:** API Documentation with Swagger UI & Postman Collection Export

---

## 🔵 Week 4: Advanced Backend Engineering & Production Hardening
- [ ] **Day 22:** Intro to Redis in Docker & High-Performance Caching Strategies
- [ ] **Day 23:** Implementing Redis Caching for Product Catalog & Categories
- [ ] **Day 24:** Cache Invalidation Patterns (Evicting Redis cache on Product mutations)
- [ ] **Day 25:** Automated Testing Part 1: Unit Testing API Controllers & Services with Jest
- [ ] **Day 26:** Automated Testing Part 2: Integration Testing Express Routes with Supertest
- [ ] **Day 27:** Database Indexing & Query Performance Optimization in PostgreSQL
- [ ] **Day 28:** Rate Limiting & Redis-backed API Throttling
- [ ] **Day 29:** Production Build Optimization & Environment Hardening
- [ ] **Day 30:** Final Backend Code Review, Architecture Documentation & GitHub Release

---

## 🎨 Phase 2: Next.js App Router Full-Stack Frontend Integration (Post-Backend Phase)

### 📌 Milestone 1: Next.js Setup, Styling & Auth Architecture
- [ ] **Task 31:** Next.js Project Setup (App Router), Tailwind CSS Design System, Shadcn UI Primitives & Lucide Icons
- [ ] **Task 32:** Auth Context Provider, Axios Interceptors (`withCredentials: true`), Cookie Session & Next.js Middleware Protection (`middleware.ts`)

### 📌 Milestone 2: Merchant Store Dashboard & Cloudinary Uploads
- [ ] **Task 33:** Merchant Dashboard Layout (`app/dashboard/layout.tsx`), Server vs Client Components (`'use client'`), Nested Routes
- [ ] **Task 34:** Product Creation Form using React Hook Form + Zod Resolver (`@hookform/resolvers/zod`) & Cloudinary Drag-and-Drop Image Dropzone
- [ ] **Task 35:** Store Inventory Table, Loading Skeletons (`loading.tsx`), Error Boundaries (`error.tsx`), & TanStack Query (React Query / SWR)

### 📌 Milestone 3: Customer Storefront, Catalog & SEO
- [ ] **Task 36:** Multi-Tenant Public Store Pages (`/stores/[slug]`), Dynamic Routing, & Dynamic SEO Metadata (`generateMetadata`)
- [ ] **Task 37:** Advanced Product Catalog (Live Search Input, Category Tree Sidebar, Range Sliders, & Offset Pagination Controls)
- [ ] **Task 38:** Product Detail Page (`/products/[id]`) with Next Image Optimization (`<Image />`) & Stock Badge Indicator

### 📌 Milestone 4: Cart State, Checkout & Production Deployment
- [ ] **Task 39:** Interactive Shopping Cart Drawer UI, Cart LocalStorage Synchronization, & State Persistence
- [ ] **Task 40:** Checkout Flow Page, Stripe Payment Webhook Integration, & Toast Feedback Notifications
- [ ] **Task 41:** Full-Stack Production Deployment (Vercel Build Optimization, `NEXT_PUBLIC_` Env Vars, & Live Render/Vercel Links)
