# Month 2 Day 02: PostgreSQL Setup, Database Tooling & SQL Basics

## 📌 Executive Summary
On Day 01, we designed our E-Commerce relational database schema on paper. Today on **Day 02**, we get hands-on with **PostgreSQL**, setup database GUI tools (**DBeaver / pgAdmin / VS Code extensions**), understand connection strings, master `psql` command-line operations, and learn core **SQL syntax** (`CREATE TABLE`, `INSERT INTO`, `SELECT`, `UPDATE`, `DELETE`).

---

## 1. What is PostgreSQL?
PostgreSQL (often called "Postgres") is an enterprise-grade, open-source **Relational Database Management System (RDBMS)**.

- **Process Model:** Runs as a background service listening on port **`5432`** by default.
- **Client-Server Architecture:**
  - **Server (Daemon):** Manages disk storage, memory buffer pool, indexing, and executes SQL queries.
  - **Client (GUI / CLI / Node.js):** Connects to port 5432, sends SQL commands, and receives tabular result sets.

---

## 2. Anatomy of a PostgreSQL Connection URL

```text
postgresql://username:password@localhost:5432/database_name?schema=public
```

```text
================================================================================================
  Component        | Value                      | Description
-------------------+----------------------------+-----------------------------------------------
  Protocol         | postgresql://              | Database connection protocol
  Username         | postgres                   | Superuser / database owner name
  Password         | postgres (or custom)       | Authentication password
  Host             | localhost (127.0.0.1)      | Database server IP/domain
  Port             | 5432                       | Default PostgreSQL port
  Database Name    | ecommerce_db               | Specific database inside PostgreSQL instance
  Schema           | ?schema=public             | Default schema namespace in PostgreSQL
================================================================================================
```

---

## 3. Command Line (`psql`) Step-by-Step Guide 🛠️

Follow these steps to connect and create your database directly from **CMD** or **PowerShell**:

### Step 1: Log into PostgreSQL CLI (`psql`)
Open CMD or PowerShell and run:
```cmd
psql -U postgres
```
*(Enter your password when prompted).*

> 💡 **If CMD says `'psql' is not recognized`:**
> Run using the full path:
> `"C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres`

### Step 2: Create the `ecommerce_db` Database
```sql
CREATE DATABASE ecommerce_db;
```

### Step 3: List All Databases
```sql
\l
```

### Step 4: Connect to `ecommerce_db`
```sql
\c ecommerce_db
```

### Step 5: Test Creating a Table & Listing Tables
```sql
CREATE TABLE test_users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

\dt
```

### Step 6: Exit PostgreSQL CLI
```sql
\q
```

---

## 4. Recommended Database GUI Tools

To visualize your databases, tables, and rows visually, install one of the following:

1. **DBeaver (Recommended):** Universal free database GUI with schema visualizers.
2. **pgAdmin 4:** Official administration web/desktop app for PostgreSQL.
3. **VS Code PostgreSQL Extension:** Directly inspect tables inside VS Code!

---

## 5. Core SQL Syntax Overview

### A. Data Definition Language (DDL) - `CREATE TABLE`
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(20) DEFAULT 'CUSTOMER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### B. Data Manipulation Language (DML)

#### 1. `INSERT INTO` (Adding Records)
```sql
INSERT INTO users (name, email, role) 
VALUES ('Shoaib Rawn', 'shoaib@example.com', 'ADMIN');
```

#### 2. `SELECT` (Querying Records with Filtering)
```sql
SELECT id, name, email, role 
FROM users 
WHERE role = 'ADMIN' 
ORDER BY id DESC;
```

#### 3. `UPDATE` (Modifying Records)
```sql
UPDATE users 
SET name = 'Shoaib Rawn (Updated)' 
WHERE id = 1;
```

#### 4. `DELETE` (Removing Records)
```sql
DELETE FROM users 
WHERE id = 1;
```

---

## 💡 Summary Checklist
- [x] Understand PostgreSQL client-server process on port `5432`.
- [x] Deconstruct database connection URLs (`postgresql://...`).
- [x] Master `psql` CLI commands (`psql -U postgres`, `CREATE DATABASE`, `\l`, `\c`, `\dt`, `\q`).
- [x] Learn DDL & DML SQL queries (`CREATE`, `INSERT`, `SELECT`, `UPDATE`, `DELETE`).
