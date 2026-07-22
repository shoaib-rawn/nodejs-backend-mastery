# Implementation Plan: 3 Projects in 3 Months (Backend Mastery)

This roadmap covers the **Yellow Tabs** from the roadmap.sh image while building **3 distinct, portfolio-ready projects**.

*Note: All project files are being saved directly in the open anti folder (`D:\anti`). We will create a new sub-folder for each month's project.*

---

## 🟡 Month 1: Project 1 - Task Manager API
**Yellow Tabs Covered:** Internet Basics, OS/General, Git (Git Flow), Node.js, APIs (REST/JSON), TypeScript Basics.
**Goal:** Learn how APIs work, establish Git best practices, and build a structured REST API.

* **Week 1:** Server Setup, Express Routing, HTTP Methods (GET, POST), **Setup Git Flow (create `dev` branch)**.
* **Week 2:** Middleware, Centralized Error Handling, Postman, TypeScript Setup, **Feature Branching (no direct pushes to `main`/`dev`)**.
* **Week 3:** Deep dive into RESTful principles, Input Validation (Zod), **Pull Request Flow (Mock PR reviews)**.
* **Week 4:** Advanced Routing, Environment Variables, Helmet + Rate-limiting, Project Polish.

---

## 🟡 Month 2: Project 2 - E-Commerce API
**Yellow Tabs Covered:** PostgreSQL, Prisma ORM, Web Security, HTTPS, Relational Database Modeling.
**Goal:** Master relational databases, complex data modeling, and web security.

* **Week 5:** Intro to Databases (SQL vs NoSQL), PostgreSQL setup, **Relational Pacing (foreign keys, joins)**.
* **Week 6:** Prisma ORM, Migrations, **E-Commerce Data Modeling (Users ➔ Products ➔ Orders relationships, One-to-Many & Many-to-Many)**.
* **Week 7:** Web Security Basics, CORS, Password Hashing (bcrypt), **JWT Access Tokens + Refresh Tokens**.
* **Week 8:** Protected Routes, File Uploads (Images), Security hardening.

---

## 🟡 Month 3: Project 3 - Real-Time Chat API (Slack Clone)
**Yellow Tabs Covered:** Docker, WebSockets (Socket.io), MongoDB (NoSQL), Redis, Testing (Jest).
**Goal:** Build a high-performance, real-time containerized chat application.

* **Week 9:** **Docker Setup (Containerize MongoDB & Redis immediately)**, Real-time WebSockets with Socket.io.
* **Week 10:** MongoDB Atlas, Mongoose Schemas, Chat History storage (NoSQL document model scalability).
* **Week 11:** Introduction to Caching, **Add Redis rate-limiting & caching to API**.
* **Week 12:** Automated Testing (Jest), production bundle optimization, deployment.

---

## 🟣 Month 4: Project 4 - Parcel Tracking System API
**Technologies Covered:** Advanced WebSockets, Webhooks, Role-Based Access Control (RBAC), Geographic Data (PostGIS/MongoDB Geospatial).
**Goal:** Build a real-time logistics tracking system (like TCS, FedEx, or Amazon Logistics) with live package updates and geographic tracking.

* **Week 13:** Advanced Database Relations (Couriers, Vehicles, Hubs, Parcels), generating Tracking Numbers.
* **Week 14:** Event-Driven Architecture, Webhooks for status events ("Dispatched", "In Transit", "Delivered").
* **Week 15:** Role-Based Access Control (Admin Dashboard, Courier App, Customer View), Barcode/QR Code generation.
* **Week 16:** Real-Time Live Location updates using WebSockets and Geographic Data queries, Final Polish.

---

## Format
Every day will follow the same pattern:
1. **Theory:** Brief explanation of the day's concept (saved in `/docs`).
2. **Implementation:** Writing the code together.
3. **Homework:** A small task for you to complete to prove you understand the concept.
