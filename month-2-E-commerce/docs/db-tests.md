# 🧪 Database Testing Reference Guide (Days 01 - 06)

This document provides a concise, day-wise cheat sheet for verifying database schemas, connections, and referential constraints in your development environment.

---

## 🐳 Day 01: Docker Database Spin-Up
**Goal**: Verify that your PostgreSQL database container starts up and is ready to accept connections.
1. Spin up the container services:
   ```bash
   docker compose up -d
   ```
2. Verify the containers are active and running:
   ```bash
   docker ps
   ```
   *Expected output: `ecom_postgres` (port `5432`) and `ecom_redis` (port `6379`) should show status `Up`.*

---

## 🛠️ Day 02: Direct Database Access (psql)
**Goal**: Confirm direct access to the database engine running inside the Docker container.
1. Log in to the PostgreSQL shell (`psql`) inside your container:
   ```bash
   docker exec -it ecom_postgres psql -U postgres -d ecommerce_db
   ```
2. List the active database tables to verify connection:
   ```sql
   \dt
   ```
3. Exit the PostgreSQL command-line:
   ```sql
   \q
   ```

---

## 💎 Day 03: Prisma ORM & API Health Check
**Goal**: Verify that the Express API can successfully establish a connection to PostgreSQL through Prisma.
1. Push any initial schemas and regenerate client types:
   ```bash
   npx prisma db push
   ```
2. Start the API development server:
   ```bash
   npm run dev
   ```
3. Open a browser or run a GET request to the healthcheck endpoint:
   `http://localhost:5000/api/v1/health`
   *Expected response: `{ "status": "success", "message": "E-Commerce API Service and PostgreSQL are running!" }`*

---

## 👤 Day 04: One-to-One (1:1) Relation & Cascade Delete
**Goal**: Validate the User-to-Profile relation and ensure deleting a user purges their metadata.
1. Sync schema changes and launch Prisma Studio:
   ```bash
   npx prisma db push
   npx prisma studio
   ```
2. In **User** tab: Click **Add record**, fill in email/password, and click **Save 1 change**.
3. In **Profile** tab: Click **Add record**, fill in name/address fields, double-click the `userId`/`user` relation cell, link it to the User you created, and click **Save 1 change**.
4. In **User** tab: Select your test user, click **Delete 1 record**, and click **Save 1 change**.
5. In **Profile** tab: Confirm the profile was automatically deleted (validates `onDelete: Cascade`).

---

## 📦 Day 05: One-to-Many (1:N) Relation & Delete Safeguards
**Goal**: Validate Category-Product-Review relations, block orphaned records (`Restrict`), and verify cascades.
1. Sync schema changes and launch Prisma Studio:
   ```bash
   npx prisma db push
   npx prisma studio
   ```
2. **Verify onDelete: Restrict** (Category ➔ Product):
   * Create and save a `Category` (e.g. "Electronics").
   * Create and save a `Product` linked to that Category.
   * Try to delete the `Category` and click **Save**.
   * *Expected Behavior: The database raises an error (`P2003: Foreign key constraint violated`) and blocks the deletion because active products remain.*
3. **Verify onDelete: Cascade** (Product ➔ Review):
   * Create and save a `Review` linked to both a User and the Product.
   * Delete the `Product` and click **Save**.
   * Go to the **Review** tab and confirm the review was automatically deleted.

---

## 🧾 Day 06: Many-to-Many (N:M) Junction Tables & Cart Constraints
**Goal**: Validate composite unique indices on `CartItem`, check explicit junction data (`priceAtPurchase` on `OrderItem`), and verify order delete restrictions.
1. Sync schema changes and launch Prisma Studio:
   ```bash
   npx prisma db push
   npx prisma studio
   ```
2. **Verify Composite Unique Index on CartItem**:
   * Add a `CartItem` record for User `2` and Product `1`. Click **Save**.
   * Try to add a *second* `CartItem` record for the exact same User `2` and Product `1`. Click **Save**.
   * *Expected Behavior: The database rejects the query (`Unique constraint failed on the fields: (userId,productId)`) because of the @@unique composite index.*
3. **Verify onDelete: Restrict** (Product ➔ OrderItem):
   * Create an `Order` and create an `OrderItem` linked to that Order and Product. Save both.
   * Try to delete the `Product` from the database.
   * *Expected Behavior: The database blocks the deletion (`P2003: Foreign key constraint violated`) because the product has active sales history.*

