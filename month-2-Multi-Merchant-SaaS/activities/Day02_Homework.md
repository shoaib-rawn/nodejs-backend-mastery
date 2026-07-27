# Month 2 Day 02 Homework: PostgreSQL & SQL Hands-On Challenge 🐘

## 🎯 Task Objective
Practice writing standard SQL statements to build a mock `products` table and test `SELECT`, `INSERT`, `UPDATE`, and `DELETE` commands.

---

## 📝 Challenge Requirements

### Part 1: Write the `CREATE TABLE` DDL SQL
Write a SQL query to create a `products` table with:
- `id`: Auto-incrementing Primary Key (`SERIAL PRIMARY KEY`).
- `title`: String up to 255 characters (`VARCHAR(255)`), cannot be null.
- `price`: Decimal number with 2 decimal places (`DECIMAL(10,2)`), non-negative.
- `stock`: Integer (`INT`), default to `0`.
- `is_active`: Boolean (`BOOLEAN`), default to `true`.

---

### Part 2: Insert 3 Sample Products
Write `INSERT INTO products` statements to add:
1. Product 1: Wireless Mouse, Price: 29.99, Stock: 50
2. Product 2: Mechanical Keyboard, Price: 89.99, Stock: 20
3. Product 3: Gaming Monitor, Price: 299.99, Stock: 5

---

### Part 3: Write Query Commands
1. **Query 1:** Select all products where `price > 50.00`.
2. **Query 2:** Update the stock of 'Mechanical Keyboard' to 15.
3. **Query 3:** Delete the product with `id = 1`.

---

## 📥 Solution Verification
Check your queries against [Day02_Homework_Guide.md](file:///d:/anti/month-2-E-commerce/activities/Day02_Homework_Guide.md)!
