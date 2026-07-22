# Day 01 Homework Guide: E-Commerce Database Architecture 🛒

This guide provides a clean, visual architectural reference for the **Day 01 E-Commerce Database Modeling Challenge**.

---

## 📐 1. Visual Entity-Relationship Diagram (ERD)

```text
+-------------------+           +-------------------+           +-------------------+
|       USER        |           |     CATEGORY      |           |      PRODUCT      |
+-------------------+           +-------------------+           +-------------------+
| id (PK)           |           | id (PK)           |           | id (PK)           |
| email (UNIQUE)    |           | name (UNIQUE)     |----+      | category_id (FK)  |<--+
| name              |           | slug (UNIQUE)     |    |      | title             |   |
| password_hash     |           +-------------------+    |      | price             |   |
| role              |                                    |      | stock             |   |
+-------------------+                                    |      +-------------------+   |
          |                                              |                |             |
          | 1                                            | 1:N            | 1 (1:N)     |
          |                                              v                v             |
          |                                     +-------------------+ +---------------+ |
          |                                     |      PRODUCT      | |  ORDER_ITEM   |-+
          |                                     +-------------------+ +---------------+
          |                                     | category_id (FK)  | | id (PK)       |
          |                                     +-------------------+ | order_id (FK) |<--+
          v                                                           | product_id(FK)|   |
+-------------------+                                                 | quantity      |   |
|       ORDER       |                                                 | price_at_buy  |   |
+-------------------+                                                 +---------------+   |
| id (PK)           |                                                         ^           |
| user_id (FK)      |---------------------------------------------------------+-----------+
| total_amount      |                           1:N
| status            |
```

---

## 🏛️ 2. Detailed Table Schemas

```text
================================================================================================
                                TABLE 1: USER (Accounts & Profiles)
================================================================================================
  Column Name     | Data Type      | Constraints / Keys      | Description
------------------+----------------+-------------------------+----------------------------------
  id              | UUID / INT     | PRIMARY KEY             | Unique user identifier
  name            | VARCHAR(100)   | NOT NULL                | Customer full name
  email           | VARCHAR(255)   | UNIQUE, NOT NULL        | User login email address
  password_hash   | VARCHAR(255)   | NOT NULL                | Encrypted password (bcrypt)
  role            | VARCHAR(20)    | DEFAULT 'CUSTOMER'      | Role: CUSTOMER or ADMIN
================================================================================================
```

```text
================================================================================================
                                TABLE 2: CATEGORY (Product Categories)
================================================================================================
  Column Name     | Data Type      | Constraints / Keys      | Description
------------------+----------------+-------------------------+----------------------------------
  id              | UUID / INT     | PRIMARY KEY             | Unique category identifier
  name            | VARCHAR(100)   | UNIQUE, NOT NULL        | Category title (e.g. Electronics)
  slug            | VARCHAR(100)   | UNIQUE, NOT NULL        | URL friendly slug (electronics)
================================================================================================
```

```text
================================================================================================
                                TABLE 3: PRODUCT (Items for Sale)
================================================================================================
  Column Name     | Data Type      | Constraints / Keys      | Description
------------------+----------------+-------------------------+----------------------------------
  id              | UUID / INT     | PRIMARY KEY             | Unique product identifier
  title           | VARCHAR(255)   | NOT NULL                | Item title
  price           | DECIMAL(10, 2) | NOT NULL, price >= 0    | Unit price tag
  stock           | INT            | NOT NULL, stock >= 0    | Available inventory quantity
  category_id     | UUID / INT     | FOREIGN KEY             | References Category(id)
================================================================================================
```

```text
================================================================================================
                                TABLE 4: ORDER (Customer Purchases)
================================================================================================
  Column Name     | Data Type      | Constraints / Keys      | Description
------------------+----------------+-------------------------+----------------------------------
  id              | UUID / INT     | PRIMARY KEY             | Unique order identifier
  user_id         | UUID / INT     | FOREIGN KEY             | References User(id)
  total_amount    | DECIMAL(10, 2) | NOT NULL                | Total purchase cost
  status          | VARCHAR(30)    | DEFAULT 'PENDING'       | PENDING, PAID, SHIPPED, DELIVERED
================================================================================================
```

```text
================================================================================================
                      TABLE 5: ORDER_ITEM (Many-to-Many Junction Table)
================================================================================================
  Column Name     | Data Type      | Constraints / Keys      | Description
------------------+----------------+-------------------------+----------------------------------
  id              | UUID / INT     | PRIMARY KEY             | Line item identifier
  order_id        | UUID / INT     | FOREIGN KEY             | References Order(id)
  product_id      | UUID / INT     | FOREIGN KEY             | References Product(id)
  quantity        | INT            | NOT NULL, quantity > 0  | Units purchased
  price_at_buy    | DECIMAL(10, 2) | NOT NULL                | Fixed historical price at checkout
================================================================================================
```

---

## 🔗 3. Relationship Rules Explained

1. **User ➔ Order (1:N):**
   - One user can place many orders. The foreign key `user_id` lives inside the `ORDER` table.

2. **Category ➔ Product (1:N):**
   - One category contains many products. The foreign key `category_id` lives inside the `PRODUCT` table.

3. **Order ➔ Product (Many-to-Many / N:M):**
   - An order contains multiple products, and a product can be inside multiple orders. 
   - We use the **`ORDER_ITEM` Junction Table** to connect `order_id` and `product_id`.
