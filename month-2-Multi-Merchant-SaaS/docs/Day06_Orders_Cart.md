# Month 2 Day 06: Relational Data Modeling Part 3 - Orders, Cart & Order Items (N:M Junction Tables)

## 📌 Executive Summary
Yesterday, we modeled one-to-many (1:N) relationships with Categories and Products. Today on **Day 06**, we design the core transactional backbone of our e-commerce application: **Carts, Orders, and Order Items**. You will learn the mechanics of **many-to-many (N:M) relationships**, compare implicit vs. explicit junction tables in Prisma, and analyze why storing static transaction history (like price snap-shots) is vital for commercial auditing.

---

## 1. What is a Many-to-Many (N:M) Relationship?

A **many-to-many (N:M) relationship** occurs when:
- A record in **Table A (Order)** can be associated with *many* records in **Table B (Product)**.
- A record in **Table B (Product)** can be associated with *many* records in **Table A (Order)**.

### 🔌 Why Junction Tables are Necessary
Relational databases cannot directly link two tables in a many-to-many configuration. We cannot store multiple foreign keys in a single column without violating normalization principles.
To solve this, we introduce a third table called a **Junction Table** (or Associate Table). This table breaks down the N:M relationship into two separate **one-to-many (1:N)** relationships:
1. **`Order` (1) ➔ `OrderItem` (N)**
2. **`Product` (1) ➔ `OrderItem` (N)**

---

## 2. Implicit vs. Explicit Junction Tables in Prisma

Prisma handles junction tables in two ways:

### Option A: Implicit Many-to-Many
Prisma automatically creates and manages a hidden junction table under the hood (e.g., `_OrderToProduct`).
* **Prisma Syntax**:
  ```prisma
  model Order {
    id       Int       @id @default(autoincrement())
    products Product[]
  }
  model Product {
    id     Int     @id @default(autoincrement())
    orders Order[]
  }
  ```
* **Limitation**: Implicit relations only store the foreign keys of the two models. You **cannot** add extra columns (like quantity or purchase price) to the relationship.

### Option B: Explicit Junction Table (Recommended for Transactions)
You manually define the junction table as a model in the schema. This allows you to attach custom transactional attributes to the relation.
* **Prisma Syntax**:
  ```prisma
  model OrderItem {
    id              Int     @id @default(autoincrement())
    orderId         Int
    order           Order   @relation(fields: [orderId], references: [id])
    productId       Int
    product         Product @relation(fields: [productId], references: [id])
    quantity        Int
    priceAtPurchase Decimal // Custom relation metadata
  }
  ```

---

## 3. Financial Integrity: Freezing Transaction Data

In an e-commerce platform, a product's price changes over time (due to discounts, inflation, or catalog updates).
* **The Bug**: If you calculate order totals by joining the `OrderItem` with the live `Product.price` column, past orders will retroactively change in price.
* **The Solution**: Always store a static snapshot of the price at the exact moment of checkout: **`priceAtPurchase`**. This guarantees historical ledger integrity for financial audits.

---

## 4. Shopping Carts vs. Checkout Orders

Carts and Orders behave very differently under delete operations:

| Feature | `CartItem` (Shopping Cart) | `OrderItem` (Order History) |
| :--- | :--- | :--- |
| **Purpose** | Temporary selection before buying. | Permanent historical transaction record. |
| **Delete Behavior** | **`Cascade`**: If a product is deleted from the store, it is automatically wiped from all shopping carts. | **`Restrict`**: A product *cannot* be deleted from the database if it exists in any past order invoice. |
| **Indexing** | Unique constraint on `[userId, productId]`. | Linked via a composite index or standard foreign key. |

---

## 💡 Key Architectural Takeaways
1. **Explicit Junction Tables** are mandatory when relationships hold metadata (e.g. quantity, discounts, purchase price).
2. **Composite Unique Indices** (`@@unique([userId, productId])`) on `CartItem` prevent duplicate rows for the same item, allowing simple quantity increments.
3. **Data Snapshots** (`priceAtPurchase`) preserve accounting history against catalog changes.
