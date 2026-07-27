# Month 2 Day 05 - Homework Challenge: Product Catalog & Category Constraints

## 🎯 Goal
Practice modeling one-to-many (1:N) relationships, configuring database constraints, and working with complex prisma queries.

---

## 💻 Task 1: Extend the Schema (Add Product Reviews)
Currently, users can buy products. We want to allow users to leave reviews on products.
1. Add a new model `Review` to `prisma/schema.prisma`.
2. A `Review` should have:
   - `id`: Int @id @default(autoincrement())
   - `rating`: Int (from 1 to 5)
   - `comment`: String
   - `createdAt`: DateTime @default(now())
   - `updatedAt`: DateTime @updatedAt
3. Establish relationships:
   - **`User` (1) ➔ `Review` (N)**: A user can write many reviews. If a user is deleted, their reviews should be deleted (`onDelete: Cascade`).
   - **`Product` (1) ➔ `Review` (N)**: A product can have many reviews. If a product is deleted, its reviews should be deleted (`onDelete: Cascade`).

---

## 💻 Task 2: Implement and Test Referrals & Indexes
1. Generate the Prisma Client and push changes to the database:
   ```bash
   npx prisma db push
   ```
2. Verify relations using **Prisma Studio**:
   - Create a User, Category, and Product.
   - Create 2 Reviews for that Product (one by the created user, another by a secondary test user).
   - Verify that you can view reviews linked to the Product.
   - Delete the Product and verify that its associated reviews are deleted automatically (Cascade).

---

## 🔍 Self-Reflection Questions
1. Why did we choose `onDelete: Cascade` for Reviews, but `onDelete: Restrict` for Products inside a Category?
2. What index gets created automatically when we declare a field as `@unique`? How does this benefit slug-based queries?
