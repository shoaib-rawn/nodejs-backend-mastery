# Day 07: Relational Multi-Tenancy, Self-Referential Data & Database Seeding

Welcome to Day 07 of your Node.js Backend Mastery course! Today, we are implementing a major architectural upgrade: shifting our backend from a standard single-merchant API to a **Multi-Merchant SaaS Platform (Shopify Clone)**. 

To achieve this, we will dive into advanced relational database concepts including multi-tenancy isolation models, self-referential relationships, database seeding, and migrations.

---

## 1. Multi-Tenancy Architecture Patterns

In software engineering, **Multi-Tenancy** is an architecture where a single instance of a software application serves multiple customers (called **tenants** or **merchants**). 

There are three primary database patterns for isolation:

### A. Logical Isolation (Shared Database, Shared Schema)
*   **How it works:** All tenants share the same database tables. Every tenant-specific table contains a foreign key column (e.g., `storeId`). All queries must explicitly filter by this column (e.g., `WHERE storeId = 42`).
*   **Pros:** Extremely cheap to scale, simple server deployment, easy to run cross-tenant reporting for platform admins.
*   **Cons:** Risk of noisy neighbor performance issues; high security risk of data leaks if a developer forgets to filter by `storeId` in a query.
*   **Used by:** Slack, Shopify, Jira, Plane.so.
*   *Note: This is the pattern we are implementing in our E-Commerce SaaS API.*

### B. Schema Isolation (Shared Database, Separate Schemas)
*   **How it works:** One database instance is used, but each tenant has its own isolated namespace (schema) inside the database (e.g., `tenant_a.products`, `tenant_b.products`).
*   **Pros:** Better security, easy to drop or backup a single tenant's schema.
*   **Cons:** Harder to run migrations across all tenant schemas simultaneously; database connection pooling limits can be reached quickly.

### C. Physical Isolation (Separate Databases)
*   **How it works:** Each tenant gets their own completely separate physical database server or cluster.
*   **Pros:** Maximum security, zero performance interference, custom configurations per tenant.
*   **Cons:** Very expensive, high maintenance overhead.
*   **Used by:** Salesforce (for heavy enterprise clients).

---

## 2. Self-Referential Relationships

A **self-referential relationship** occurs when a database table has a foreign key that references its own primary key. This is essential for modeling hierarchies.

### A. 1:N Self-Referential (Hierarchy Tree)
In E-Commerce, category hierarchies are highly dynamic. A category (e.g., "Laptops") has a parent category ("Electronics"), which might have a parent category ("Department"). 

We model this by adding a nullable `parentId` pointing back to `Category.id`:

```prisma
model Category {
  id        Int        @id @default(autoincrement())
  name      String
  parentId  Int?       // Nullable for top-level categories
  parent    Category?  @relation("SubCategories", fields: [parentId], references: [id], onDelete: Cascade)
  children  Category[] @relation("SubCategories")
}
```

*   **Syntax Explanation:**
    *   `parent Category?`: Defines the optional parent record.
    *   `@relation("SubCategories", fields: [parentId], references: [id])`: Establishes the relationship. The string name `"SubCategories"` binds the parent relation to the corresponding list array `children Category[]`.

### B. N:M Self-Referential (Recommendations & Bundles)
Often, you want to link items to other items in the same table, such as recommending a "Mouse" when someone views a "Laptop". This is an N:M self-referential relation, which requires a junction table:

```prisma
model RelatedProduct {
  id             Int      @id @default(autoincrement())
  productId      Int
  relatedId      Int
  product        Product  @relation("ProductOrigin", fields: [productId], references: [id], onDelete: Cascade)
  relatedProduct Product  @relation("ProductRelated", fields: [relatedId], references: [id], onDelete: Cascade)

  @@unique([productId, relatedId])
}
```

---

## 3. Store-Scoped Sequences

In enterprise software, identifiers are often formatted relative to a specific tenant rather than globally.
*   **Global Sequence:** Order primary keys are auto-incrementing globally across all stores (e.g., Order 1, Order 2, Order 3).
*   **Store-Scoped Sequence:** Each store wants its invoice numbers starting at 1 (e.g., Nike Order #1, Adidas Order #1).

We achieve store-scoped sequences in Prisma using a composite unique constraint:
```prisma
model Order {
  id          Int   @id @default(autoincrement())
  storeId     Int
  orderNumber Int   // E.g., 1, 2, 3...
  
  @@unique([storeId, orderNumber])
}
```
During checkout, the API will query the database to find the maximum `orderNumber` currently registered for `storeId`, increment it by 1, and write the new record. The composite unique constraint guarantees that no two orders in the same store will ever share the same invoice number.

---

## 4. Database Seeding Best Practices

**Database Seeding** is the process of populating a blank database with a set of default or realistic developer data. 

### Why is seeding crucial?
1.  **Consistent Local Development:** Every developer on the team can spin up the environment and instantly have accounts, categories, and inventory items to test.
2.  **Automated Testing Integration:** Integration tests run on seeded data to verify route logic.

*   **Order of Operations:** When seeding, you MUST delete and write tables in correct relational order. You cannot delete a User if they have orders linked to them (due to foreign key constraints). You must wipe child records (e.g., `OrderItem`) before parent records (e.g., `Order`, `Product`, `User`).

---

## 5. Prisma Migration CLI Reference

| Command | Environment | Description |
| :--- | :--- | :--- |
| `npx prisma migrate dev --name <migration_name>` | Development | Compiles schema modifications, writes a SQL script, drops/applies it to the local DB, and regenerates Prisma Client. |
| `npx prisma migrate reset --force` | Development | Wipes the entire local database schema, re-applies all migrations from scratch, and runs the seed script. |
| `npx prisma db seed` | Dev / Staging | Explicitly executes the script defined in the `"prisma.seed"` block of `package.json`. |
| `npx prisma migrate deploy` | Production | Applies pending compiled SQL migrations without dropping tables or prompting for interactive input. |
