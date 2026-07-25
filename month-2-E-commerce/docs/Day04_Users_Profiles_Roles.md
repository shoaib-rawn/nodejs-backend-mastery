# Month 2 Day 04: Relational Data Modeling Part 1 - Users, Profiles & Roles (1:1 Relationships)

## 📌 Executive Summary
Yesterday, we containerized our PostgreSQL server and verified our database connection using Prisma. Today on **Day 04**, we lay the foundations of our relational e-commerce application by modeling the **User**, **Profile**, and **Role** entities. You will learn the mechanics of **one-to-one (1:1) relationships** in relational databases, write clean Prisma schema structures, understand when to use Database Enums vs. Join tables for roles, and apply referential actions (like Cascade deletes).

---

## 1. What is a One-to-One (1:1) Relationship?

In relational databases, a **one-to-one (1:1) relationship** means that:
- A record in **Table A** can be associated with at most *one* record in **Table B**.
- A record in **Table B** can be associated with at most *one* record in **Table A**.

### 👤 Why Separate User and Profile?
It is a standard industry practice to split authentication details and personal profile details into two separate tables:
1. **`User` Table (Auth context)**: Holds fields critical for system authentication and security (like `email`, `password`, `role`, and timestamps). This table is kept small and highly indexed for fast lookups during login/JWT generation.
2. **`Profile` Table (Personal context)**: Holds details about the human user (like `firstName`, `lastName`, `phone`, `avatarUrl`, and physical addresses). 

**Benefits of this separation**:
- **Security Isolation**: Keeps authentication credentials separate from generic user metadata.
- **Query Performance**: Avoids loading heavy metadata columns (e.g. bio, profile picture URLs) into memory when checking session status or auth permissions.
- **Clarity**: Each table serves a single, well-defined business purpose.

---

## 2. Implementing 1:1 Relations in SQL vs. Prisma

### ⚙️ The SQL Approach
In pure SQL, a 1:1 relationship is established by:
1. Creating a **Foreign Key (FK)** in the dependent table pointing to the parent table's Primary Key.
2. Applying a **UNIQUE** constraint on that Foreign Key column. This ensures that no two profile records can point to the same user.

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE profiles (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  user_id INT UNIQUE NOT NULL, -- The UNIQUE constraint makes this 1:1
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### 💎 The Prisma Approach
In Prisma, the same relationship is declared by defining:
- A relation field (`profile Profile?`) on the parent model `User`.
- A relation field (`user User @relation(...)`) and a backing scalar foreign key (`userId Int @unique`) on the child model `Profile`.

```prisma
model User {
  id      Int      @id @default(autoincrement())
  email   String   @unique
  profile Profile? // Optional relation: a user may or may not have a profile
}

model Profile {
  id     Int    @id @default(autoincrement())
  userId Int    @unique // Crucial: @unique makes this a 1:1 relationship
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

> [!IMPORTANT]
> The `@unique` attribute on the `userId` field in the `Profile` model is what prevents a single User from having multiple Profiles. Without `@unique`, Prisma will interpret this as a **one-to-many (1:N)** relationship.

---

## 3. Managing Roles: Enums vs. Separate Table

When designing user access roles (e.g. Admin, Customer, Seller), backend engineers choose between two primary architectures:

### Option A: Database Enums (Prisma `enum`) - *Used in our Project*
An **Enum** (Enumerated Type) is a predefined list of string constants validated at the database level.
* **Pros**:
  * Very fast reads and writes (stored as tiny integers or mapped constants internally by PostgreSQL).
  * Hardcoded validation prevents invalid roles from ever being inserted.
  * Direct TypeScript support out of the box (Prisma generates a typescript enum for you).
* **Cons**:
  * Altering roles (e.g. adding a new role like `SUPPLIER`) requires a database migration.
  * Harder to support dynamic permissions (where admins create custom roles via a UI).

### Option B: Separate Roles Table (`Role` and `UserRole` junction)
A normalized table schema where roles are records in a database table (e.g., `id`, `name`).
* **Pros**:
  * Highly dynamic. You can add or modify roles via an Admin panel without running code or database migrations.
  * Allows mapping complex many-to-many relations (e.g., a User has many Roles, and a Role has many Permissions).
* **Cons**:
  * Slower reads because querying a user requires database `JOIN` operations across tables.
  * Higher database complexity.

> [!TIP]
> For standard SaaS or E-commerce APIs with a fixed set of roles (`CUSTOMER`, `ADMIN`), **Database Enums** are highly recommended because of performance, simplicity, and compile-time type safety.

---

## 4. Referential Actions: What is Cascade Delete?

In databases, **Referential Integrity** ensures that relationships between tables remain consistent. If a parent record is deleted, what happens to the child record pointing to it?

We configure this behavior using the `onDelete` parameter in Prisma:

### 🗑️ `onDelete: Cascade`
When a parent record is deleted, the database automatically deletes all dependent child records.
* **Example**: When a `User` is deleted, their associated `Profile` is deleted instantly.
* **Why we use it**: Prevents "orphaned records" (profiles that point to a user ID that no longer exists), keeping our database clean and saving disk space.

### Other Referential Options:
- **`Restrict`**: Prevents the parent record from being deleted if any children reference it. (e.g., You cannot delete a User if they have a Profile. You must delete the Profile first).
- **`SetNull`**: Sets the foreign key column in the child table to `NULL` when the parent is deleted. (This requires the foreign key field to be optional).

---

## 💡 Summary Checklist
- [x] Separate authentication credentials from personal user metadata.
- [x] Design 1:1 relationships using unique foreign keys in the dependent model.
- [x] Choose Database Enums for high-performance, predictable role sets.
- [x] Configure Cascade delete to ensure referential integrity.
