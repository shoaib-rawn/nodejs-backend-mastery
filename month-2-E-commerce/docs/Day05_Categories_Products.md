# Month 2 Day 05: Relational Data Modeling Part 2 - Categories & Products (1:N Relationships)

## 📌 Executive Summary
Yesterday, we modeled one-to-one relationships with Users and Profiles. Today on **Day 05**, we scale up to **one-to-many (1:N) relationships** by modeling the **Category** and **Product** entities. You will understand how 1:N relations are constructed via foreign keys, learn why URL slugs are essential for e-commerce search engine optimization (SEO), and analyze how referential actions like `onDelete: Restrict` protect catalog data integrity.

---

## 1. What is a One-to-Many (1:N) Relationship?

A **one-to-many (1:N) relationship** is the most common relationship type in database design. It states that:
- A record in **Table A (Category)** can be linked to *zero, one, or many* records in **Table B (Product)**.
- A record in **Table B (Product)** belongs to *exactly one* record in **Table A (Category)**.

### 📦 E-Commerce Application Context
In an e-commerce catalog:
* A `Category` (e.g., "Electronics") can contain thousands of `Products` (e.g., "iPhone 15", "Sony Headphones", "MacBook Pro").
* A single `Product` (e.g., "iPhone 15") is assigned to exactly one primary `Category` ("Electronics").

---

## 2. Implementing 1:N Relationships in SQL vs. Prisma

### ⚙️ The SQL Approach
In pure SQL, a 1:N relationship is established by adding a **Foreign Key (FK)** to the "many" side (the table representing the products):

```sql
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  category_id INT NOT NULL, -- Foreign Key
  CONSTRAINT fk_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
);
```

> [!NOTE]
> Unlike 1:1 relationships, the foreign key column `category_id` in the `products` table does **not** have a `UNIQUE` constraint. This allows multiple products to share the exact same `category_id`.

### 💎 The Prisma Approach
In a Prisma schema, the relation is declared bidirectionally:
1. The **`Category`** model defines an array of products: `products Product[]`.
2. The **`Product`** model defines:
   - A scalar field for the foreign key: `categoryId Int`.
   - A relation object field: `category Category @relation(fields: [categoryId], references: [id])`.

```prisma
model Category {
  id       Int       @id @default(autoincrement())
  name     String    @unique
  products Product[] // Implicitly represents the "many" side
}

model Product {
  id         Int      @id @default(autoincrement())
  name       String
  categoryId Int      // Under-the-hood foreign key
  category   Category @relation(fields: [categoryId], references: [id])
}
```

---

## 3. URL Slugs & Database Indexing

### 🔗 What is a Slug?
A **slug** is the part of a URL that identifies a particular page on a website in an easy-to-read form. 
* **Bad URL**: `https://my-store.com/products?id=4821`
* **Good URL (SEO-friendly)**: `https://my-store.com/products/iphone-15-pro-max`

### 🚀 Why Index Slugs?
Since products and categories are queried by their slugs on the frontend, lookup queries will look like:
```ts
prisma.product.findUnique({ where: { slug: 'iphone-15-pro-max' } })
```
To ensure this query runs in **O(1)** time instead of scanning the entire database table (table scan), the `slug` column **must** have:
- A `@unique` constraint (which automatically creates a B-Tree index in PostgreSQL).
- This guarantees both database-level uniqueness and ultra-fast page load times.

---

## 4. Protecting Integrity: `onDelete: Restrict` vs. `Cascade`

Referential actions define what happens to the child records (Products) when a parent record (Category) is deleted:

| Referential Action | Description | When to Use |
| :--- | :--- | :--- |
| **`Cascade`** | Deleting the parent automatically deletes all child records. | **User-to-Profile**: If a user is deleted, their profile must be wiped. |
| **`Restrict`** | The database blocks the deletion of the parent if any child records reference it. | **Category-to-Product**: Prevent accidental deletion of a Category if it still contains active Products. |
| **`SetNull`** | The foreign key in the child records is set to `NULL` when the parent is deleted. | If you want products to remain but belong to "No Category". |

### 🔒 Why `Restrict` is Essential for Catalog Management
If a store administrator deletes the "Electronics" category:
* Using **`Cascade`** would catastrophically delete every laptop, phone, and television in the inventory database.
* Using **`Restrict`** forces the admin to re-categorize or manually delete all products inside the category first, preventing massive, accidental data loss.

---

## 💡 Key Architectural Takeaways
1. **1:N relations** require a foreign key on the "many" side without a unique constraint.
2. **`Decimal`** should always be used for currency fields (`price`) in databases to avoid floating-point rounding errors (e.g., `0.1 + 0.2 = 0.30000000000000004`).
3. **`onDelete: Restrict`** acts as an essential safeguard for crucial catalog resources.
