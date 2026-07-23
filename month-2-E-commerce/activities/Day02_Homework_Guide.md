# Day 02 Homework Guide: PostgreSQL & SQL Solutions 🐘

This guide provides the complete SQL query solutions and output tables for the **Day 02 SQL Challenge**.

---

## 📐 1. Part 1 Solution: `CREATE TABLE` Query

```sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
    is_active BOOLEAN DEFAULT TRUE
);
```

---

## 📥 2. Part 2 Solution: `INSERT INTO` Statements

```sql
INSERT INTO products (title, price, stock) 
VALUES 
    ('Wireless Mouse', 29.99, 50),
    ('Mechanical Keyboard', 89.99, 20),
    ('Gaming Monitor', 299.99, 5);
```

```text
================================================================================================
                                TABLE: PRODUCTS (After Insertion)
================================================================================================
  id  | title               | price    | stock | is_active
------+---------------------+----------+-------+-----------
  1   | Wireless Mouse      | 29.99    | 50    | true
  2   | Mechanical Keyboard | 89.99    | 20    | true
  3   | Gaming Monitor      | 299.99   | 5     | true
================================================================================================
```

---

## 🔍 3. Part 3 Solution: Query Statements & Result Tables

### Query 1: Filter products with `price > 50.00`
```sql
SELECT * FROM products WHERE price > 50.00;
```

```text
================================================================================================
                                RESULT: Products where price > 50.00
================================================================================================
  id  | title               | price    | stock | is_active
------+---------------------+----------+-------+-----------
  2   | Mechanical Keyboard | 89.99    | 20    | true
  3   | Gaming Monitor      | 299.99   | 5     | true
================================================================================================
```

---

### Query 2: Update stock of 'Mechanical Keyboard' to 15
```sql
UPDATE products 
SET stock = 15 
WHERE title = 'Mechanical Keyboard';
```

```text
================================================================================================
                                RESULT: Updated Mechanical Keyboard
================================================================================================
  id  | title               | price    | stock | is_active
------+---------------------+----------+-------+-----------
  2   | Mechanical Keyboard | 89.99    | 15    | true
================================================================================================
```

---

### Query 3: Delete product where `id = 1`
```sql
DELETE FROM products WHERE id = 1;
```

```text
================================================================================================
                                FINAL TABLE: PRODUCTS (After Deletion)
================================================================================================
  id  | title               | price    | stock | is_active
------+---------------------+----------+-------+-----------
  2   | Mechanical Keyboard | 89.99    | 15    | true
  3   | Gaming Monitor      | 299.99   | 5     | true
================================================================================================
```
