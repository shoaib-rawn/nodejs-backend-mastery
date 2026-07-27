# Month 2 Day 06 - Homework Challenge: Junction Tables & Transaction History

## 🎯 Goal
Practice modeling many-to-many (N:M) relationships using explicit junction tables, enforcing composite unique constraints, and configuring status enums.

---

## 💻 Task 1: Establish the Cart and Order Schemas
Extend your `prisma/schema.prisma` file with the following models:
1. **`OrderStatus` Enum**: Predefine status tags: `PENDING`, `PAID`, `SHIPPED`, `DELIVERED`, `CANCELLED`.
2. **`CartItem`**:
   - `id`: Int @id @default(autoincrement())
   - `userId`: Int
   - `productId`: Int
   - `quantity`: Int @default(1)
   - Establish relations linking to `User` and `Product` with `onDelete: Cascade`.
   - Add a composite unique index on `[userId, productId]` to prevent a user from having separate rows for the same product.
3. **`Order`**:
   - `id`: Int @id @default(autoincrement())
   - `userId`: Int
   - `totalAmount`: Decimal
   - `status`: OrderStatus @default(PENDING)
   - Link `User` with `onDelete: Cascade`.
4. **`OrderItem` (Junction Table)**:
   - `id`: Int @id @default(autoincrement())
   - `orderId`: Int
   - `productId`: Int
   - `quantity`: Int
   - `priceAtPurchase`: Decimal (to freeze the transaction price)
   - Link `Order` with `onDelete: Cascade`.
   - Link `Product` with `onDelete: Restrict` (prevent products from being deleted if they are part of a past order).

---

## 💻 Task 2: Synchronize and Validate via Prisma Studio
1. Push your changes to PostgreSQL:
   ```bash
   npx prisma db push
   ```
2. Launch Prisma Studio:
   ```bash
   npx prisma studio
   ```
3. Perform the following tests:
   - Create a Category and Product.
   - Add the Product to a User's Cart via `CartItem`. Try to add a second record with the *same* user and product. Verify that Prisma Studio blocks it with a constraint violation.
   - Create an Order and add two `OrderItem` rows linked to it.
   - Try to delete the Product and verify that PostgreSQL blocks it because of the `Restrict` delete action on order items.

---

## 🔍 Self-Reflection Questions
1. Why is an explicit junction table preferred over an implicit many-to-many relationship for `OrderItem`?
2. What database error code is returned when a unique constraint or composite index is violated?
