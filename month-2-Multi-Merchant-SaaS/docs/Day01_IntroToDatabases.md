# Month 2 Day 01: Intro to Databases (SQL vs NoSQL & Relational Concepts)

## 📌 Executive Summary
In Month 1, we stored data in memory or local JSON files (`tasks.json`). While convenient for learning, file storage does not scale, lacks data integrity enforcement, cannot handle concurrent reads/writes safely, and risks total data corruption on server failure.

In **Month 2**, we upgrade to enterprise-grade persistence using **Relational Databases (RDBMS)** with **PostgreSQL** and **Prisma ORM**.

---

## 1. E-Commerce Entity-Relationship Architecture (ASCII Diagram)

```text
+---------------+               +-----------------+               +------------------+
|     USER      |               |     CATEGORY    |               |     PRODUCT      |
+---------------+               +-----------------+               +------------------+
| id (PK)       |               | id (PK)         |               | id (PK)          |
| email (UQ)    |               | name (UQ)       |        +----->| category_id (FK) |
| name          |               | slug (UQ)       |        |      | title            |
| password_hash |               +-----------------+        |      | price            |
| role          |                        |                 |      | stock            |
+---------------+                        | 1               |      +------------------+
        |                                | 1:N             |               |
        | 1                              v                 |               | 1 (1:N)
        |                        +-----------------+       |               v
        |                        |     PRODUCT     |-------+      +------------------+
        |                        +-----------------+              |    ORDER_ITEM    |
        |                        | category_id (FK)|              +------------------+
        |                        +-----------------+              | id (PK)          |
        |                                                         | order_id (FK)    |<--+
        v                                                         | product_id (FK)  |   |
+---------------+                                                 | quantity         |   |
|     ORDER     |                                                 | price_at_purchase|   |
+---------------+                                                 +------------------+   |
| id (PK)       |                                                                        |
| user_id (FK)  |------------------------------------------------------------------------+
| total_amount  |                                   1:N
| status        |
```

---

## 2. Why Do We Need a Real Database?
1. **Concurrency Control:** Databases handle thousands of simultaneous read and write operations without race conditions or corrupted data.
2. **ACID Guarantees:** Ensures transactions either succeed completely or fail gracefully without leaving invalid data.
3. **Data Integrity & Constraints:** Enforces rules at the storage level (e.g., email uniqueness, foreign key existence, data types).
4. **Indexing & Fast Querying:** Enables lightning-fast searches across millions of rows using B-Trees and Hash indexes.

---

## 3. SQL vs. NoSQL: Key Differences

| Feature | Relational Databases (SQL) | Document / NoSQL Databases |
| :--- | :--- | :--- |
| **Data Structure** | Tables with fixed rows and columns | Flexible collections of JSON-like documents |
| **Schema** | Strict, pre-defined schema | Dynamic / Schema-agnostic |
| **Relationships** | Highly normalized with Primary & Foreign Keys | Denormalized (embedded documents or weak references) |
| **ACID Compliance** | Strong, default compliance | Eventual consistency / tunable per database |
| **Ideal Use Case** | E-Commerce, Financials, User Accounts, Orders | Real-time Analytics, Social Feeds, Caching, Log aggregation |
| **Examples** | PostgreSQL, MySQL, SQLite | MongoDB, Redis, Cassandra |

---

## 4. Core Relational Database Terminology

### A. Tables, Rows, and Columns
- **Table:** A collection of related data items (e.g., `users`, `products`, `orders`).
- **Row (Record):** A single record inside a table (e.g., user John Doe with ID 42).
- **Column (Field):** A specific attribute of the record with a defined data type (e.g., `email VARCHAR(255)`).

### B. Keys in Relational Tables
- **Primary Key (PK):** A unique identifier for every row in a table (e.g., `id: UUID` or `id: INT`). Must never be null.
- **Foreign Key (FK):** A column in one table that references the Primary Key of another table, establishing a relational link (e.g., `orders.user_id` -> `users.id`).

---

## 5. Relationship Types in E-Commerce Data Modeling

1. **One-to-One (1:1):**
   - *Example:* A `User` has one `UserProfile`.
2. **One-to-Many (1:N):**
   - *Example:* A `User` can place many `Orders`, but an `Order` belongs to only one `User`.
   - *Example:* A `Category` has many `Products`.
3. **Many-to-Many (N:M):**
   - *Example:* A single `Order` contains many `Products`, and a `Product` can be part of many `Orders`.
   - *Implementation:* Requires a **Junction (Join) Table** (e.g., `order_items` with `order_id` FK and `product_id` FK).

---

## 6. What is ACID Compliance?

- **Atomicity:** All operations in a transaction succeed or all fail together ("All or Nothing").
- **Consistency:** Data must conform to all validation rules, constraints, and triggers before and after the transaction.
- **Isolation:** Concurrent transactions execute independently without interfering with each other.
- **Durability:** Once committed, transaction data is permanently stored even during power outages or system crashes.
