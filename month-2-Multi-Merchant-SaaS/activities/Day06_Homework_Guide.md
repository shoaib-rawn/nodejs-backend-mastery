# Month 2 Day 06 Homework Guide: Solution & Implementation Walkthrough

This guide walks you through the step-by-step solution to the Day 06 Homework Challenge. It covers extending your [schema.prisma](file:///d:/anti/month-2-E-commerce/prisma/schema.prisma) with carts and orders, explaining the code syntax line-by-line, and verification steps in **Prisma Studio**.

---

## 🛠️ Step 1: Extended Prisma Schema

Here is the completed schema code that includes the `OrderStatus` enum, `CartItem`, `Order`, and `OrderItem` models, along with detailed explanations for each field and relation.

```prisma
// File: prisma/schema.prisma

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// 🏷️ Define role levels allowed in the backend
enum Role {
  CUSTOMER // Standard customer/shopper account
  SELLER   // Merchant account to sell products
  ADMIN    // Administrative account with elevated privileges
}

// 🛒 Order status levels
enum OrderStatus {
  PENDING   // Order created, awaiting payment
  PAID      // Payment processed successfully
  SHIPPED   // Items dispatched
  DELIVERED // Received by customer
  CANCELLED // Refunded or voided
}

// 👤 User model for authentication and security details
model User {
  id        Int        @id @default(autoincrement()) // Auto-incrementing primary key
  email     String     @unique                      // User email, must be unique across the platform
  password  String                                // Securely hashed password string
  role      Role       @default(CUSTOMER)           // System access level role (defaults to CUSTOMER)
  createdAt DateTime   @default(now())              // Timestamp when account is created
  updatedAt DateTime   @updatedAt                   // Auto-updated timestamp when model changes
  profile   Profile?                                // 1:1 relation link to Profile (optional, nullable)
  reviews   Review[]                                // 1:N relationship: A user can write many reviews
  cartItems CartItem[]                              // 1:N relationship: User's temporary shopping cart
  orders    Order[]                                 // 1:N relationship: User's historical orders
}

// 📄 Profile model for personal information and addresses
model Profile {
  id         Int      @id @default(autoincrement()) // Auto-incrementing primary key
  firstName  String                                // User's first name
  lastName   String                                // User's last name
  phone      String?                               // Optional phone contact number
  avatarUrl  String?                               // Optional profile image URL
  
  // Address Fields
  street     String                                // Street number and name
  city       String                                // City address
  state      String?                               // Optional state, province, or region
  postalCode String                                // ZIP or postal code
  country    String                                // Shipping/billing country

  // Relation Mapping
  userId     Int      @unique                      // Foreign key pointing to User, must be unique for 1:1
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade) // Links profile to user with Cascade delete
  
  createdAt  DateTime @default(now())              // Timestamp when profile is created
  updatedAt  DateTime @updatedAt                   // Auto-updated timestamp when profile changes
}

// 📁 Category model for organizing products
model Category {
  id          Int       @id @default(autoincrement()) // Auto-incrementing primary key
  name        String    @unique                      // Unique display name (e.g. "Electronics")
  slug        String    @unique                      // Unique URL slug for routing/SEO (e.g. "electronics")
  description String?                                // Optional category details
  products    Product[]                              // 1:N relationship: A category contains many products
  createdAt   DateTime  @default(now())              // Timestamp when category is created
  updatedAt   DateTime  @updatedAt                   // Auto-updated timestamp on modification
}

// 📦 Product model representing catalog inventory items
model Product {
  id          Int         @id @default(autoincrement()) // Auto-incrementing primary key
  name        String                                    // Product display name
  slug        String      @unique                       // Unique URL slug for SEO lookup
  description String                                    // Description of product
  price       Decimal                                   // Precise numeric decimal for currency
  stock       Int         @default(0)                   // Quantity available in inventory
  images      String[]                                  // Postgres scalar list storing image URLs
  
  // Category Link
  categoryId  Int                                       // Foreign key reference to Category
  category    Category    @relation(fields: [categoryId], references: [id], onDelete: Restrict) // Linked category model with Restrict action
  
  reviews     Review[]                                  // 1:N relationship: A product can have many reviews
  cartItems   CartItem[]                                // 1:N relationship: Links to active shopping carts
  orderItems  OrderItem[]                               // 1:N relationship: Links to historical invoice items
  
  createdAt   DateTime    @default(now())              // Timestamp when product is added
  updatedAt   DateTime    @updatedAt                   // Auto-updated timestamp on modification
}

// 💬 Review model representing product feedback from users
model Review {
  id        Int      @id @default(autoincrement()) // Auto-incrementing primary key
  rating    Int                                   // Score given to the product (e.g., 1 to 5)
  comment   String                                // Written review text
  
  // User Link (Who wrote it)
  userId    Int                                   // Foreign key referencing User.id
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade) // Relate to User. Cascade deletes reviews on User deletion.
  
  // Product Link (What product it reviews)
  productId Int                                   // Foreign key referencing Product.id
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade) // Relate to Product. Cascade deletes reviews on Product deletion.
  
  createdAt DateTime @default(now())              // Timestamp when review is posted
  updatedAt DateTime @updatedAt                   // Auto-updated timestamp on modification
}

// 🛒 CartItem model for temporary active shopping baskets (Junction Table)
model CartItem {
  id        Int      @id @default(autoincrement()) // Auto-incrementing primary key
  userId    Int                                   // Foreign key referencing User.id
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade) // Cascade delete: wipe cart if user is deleted
  productId Int                                   // Foreign key referencing Product.id
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade) // Cascade delete: wipe cart item if product is deleted
  quantity  Int      @default(1)                  // Quantity of this product in cart
  createdAt DateTime @default(now())              // Timestamp when added to cart
  updatedAt DateTime @updatedAt                   // Auto-updated timestamp on quantity modifications

  @@unique([userId, productId])                  // Enforces unique product per user cart (preventing duplicate rows)
}

// 📄 Order model representing the main invoice header
model Order {
  id          Int         @id @default(autoincrement()) // Auto-incrementing primary key
  userId      Int                                       // Foreign key referencing User.id
  user        User        @relation(fields: [userId], references: [id], onDelete: Cascade) // Cascade delete: delete orders if user is wiped
  totalAmount Decimal                                   // Total invoice price (precision Decimal)
  status      OrderStatus @default(PENDING)             // Current shipping/payment status
  orderItems  OrderItem[]                               // 1:N relation pointing to order line items
  createdAt   DateTime    @default(now())              // Timestamp when order was placed
  updatedAt   DateTime    @updatedAt                   // Auto-updated timestamp when order status changes
}

// 🧾 OrderItem model representing explicit junction for detailed line items
model OrderItem {
  id              Int      @id @default(autoincrement()) // Auto-incrementing primary key
  orderId         Int                                   // Foreign key referencing Order.id
  order           Order    @relation(fields: [orderId], references: [id], onDelete: Cascade) // Cascade delete: delete items if parent invoice is deleted
  productId       Int                                   // Foreign key referencing Product.id
  product         Product  @relation(fields: [productId], references: [id], onDelete: Restrict) // Restrict delete: prevent catalog product from being deleted if it has sales history!
  quantity        Int                                   // Quantity purchased
  priceAtPurchase Decimal                               // Frozen price snapshot at point of transaction
  createdAt       DateTime @default(now())              // Timestamp when record was created
  updatedAt       DateTime @updatedAt                   // Auto-updated timestamp
}
```

---

## 📝 Syntax & Code Explanation

### 1. `@@unique([userId, productId])` Composite Unique Constraint
```prisma
@@unique([userId, productId])
```
*   **Actual Meaning**: Instructs the database to create a B-Tree composite unique index over the combination of the `userId` and `productId` columns.
*   **Purpose**: Prevents duplicate entries. For instance, if user `1` adds product `5` to their cart, a row is created. If they click "Add to Cart" again, we do not want a second row for `userId: 1, productId: 5` in the table. Instead, we want to update the `quantity` of the existing row. The unique constraint enforces this validation constraint at the database level.

### 2. `OrderStatus` enum
```prisma
enum OrderStatus {
  PENDING
  PAID
  ...
}
```
*   **Actual Meaning**: Defines an enum type at the PostgreSQL level.
*   **Purpose**: Restricts the values that can be inserted into the `status` column to this specific set of text tags, protecting the status state workflow.

### 3. `priceAtPurchase Decimal` snapshot column
```prisma
priceAtPurchase Decimal
```
*   **Actual Meaning**: Holds the numeric price details at the time of order placement.
*   **Purpose**: Protects historical purchase logs. If a product's price in the store is updated next month, past order totals won't break, keeping financial auditing consistent.

### 4. `onDelete: Restrict` on Product inside OrderItem
```prisma
product   Product  @relation(fields: [productId], references: [id], onDelete: Restrict)
```
*   **Actual Meaning**: The database blocks the removal of a Product if it is linked to any OrderItem.
*   **Purpose**: Prevents deleting items with active sales history, protecting the store ledger.

---

## ⚙️ Step 2: Database Sync

Once you modify the schema file, compile and push the changes to PostgreSQL by running:
```bash
npx prisma db push
```

---

## 🖥️ Step 3: Verification in Prisma Studio

1. **Launch Prisma Studio**:
   ```bash
   npx prisma studio
   ```
2. **Access your Database**:
   Open **`http://localhost:5555`** in your browser.
3. **Verify Composite Unique constraint on CartItem**:
   - Go to **CartItem** -> Click **Add record**.
   - Create a cart item for User `2` and Product `1` (or whatever ID is present). Click **Save 1 change**.
   - Click **Add record** again. Create a second cart item for the *exact same* User `2` and Product `1`. Click **Save 1 change**.
   - **Expected Behavior**: Prisma Studio throws a red validation banner error (`Unique constraint failed on the fields: (userId,productId)`) and blocks the save.
4. **Verify Restrict Delete on OrderItem**:
   - Go to **Order** -> Create a record (e.g. Total: `99.99`). Save it.
   - Go to **OrderItem** -> Create a record linked to the Order and Product. Save it.
   - Go to **Product** -> Select the product, click **Delete 1 record** -> **Save 1 change**.
   - **Expected Behavior**: The delete fails with a foreign key constraint violation error because the product has order history (`onDelete: Restrict`).
