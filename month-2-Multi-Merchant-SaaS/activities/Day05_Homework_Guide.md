# Month 2 Day 05 Homework Guide: Solution & Implementation Walkthrough

This guide walks you through the step-by-step solution to the Day 05 Homework Challenge. It covers extending your [schema.prisma](file:///d:/anti/month-2-E-commerce/prisma/schema.prisma) with the `Review` model, explanation of syntax, and verification steps in **Prisma Studio**.

---

## 🛠️ Step 1: Extended Prisma Schema

Here is the completed schema code that includes the `Category`, `Product`, and `Review` models, with detailed explanations for each field and relation.

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

// 👤 User model for authentication and security details
model User {
  id        Int      @id @default(autoincrement()) // Auto-incrementing primary key
  email     String   @unique                      // User email, must be unique across the platform
  password  String                                // Securely hashed password string
  role      Role     @default(CUSTOMER)           // System access level role (defaults to CUSTOMER)
  createdAt DateTime @default(now())              // Timestamp when account is created
  updatedAt DateTime @updatedAt                   // Auto-updated timestamp when model changes
  profile   Profile?                              // 1:1 relation link to Profile (optional, nullable)
  reviews   Review[]                              // 1:N relationship: A user can write many reviews
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
  id          Int      @id @default(autoincrement()) // Auto-incrementing primary key
  name        String                                // Product display name
  slug        String   @unique                      // Unique URL slug for SEO lookup (e.g. "iphone-15-pro")
  description String                                // Markdown or text description of product
  price       Decimal                               // Arbitrary precision decimal for currency (avoids float inaccuracies)
  stock       Int      @default(0)                  // Quantity available in inventory
  images      String[]                              // Postgres scalar list storing image URLs
  
  // Category Link
  categoryId  Int                                   // Foreign key reference to Category
  category    Category @relation(fields: [categoryId], references: [id], onDelete: Restrict) // Linked category model with Restrict action
  
  reviews     Review[]                              // 1:N relationship: A product can have many reviews
  
  createdAt   DateTime @default(now())              // Timestamp when product is added
  updatedAt   DateTime @updatedAt                   // Auto-updated timestamp on modification
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
```

---

## 📝 Syntax & Code Explanation

### 1. `Decimal` database type
```prisma
price   Decimal
```
*   **Actual Meaning**: Declares the `price` field as a `DECIMAL`/`NUMERIC` SQL type under the hood.
*   **Purpose**: Floating-point numbers (`Float` or `Double`) are represented in binary, which leads to precision loss (e.g. `0.1 + 0.2 = 0.30000000000000004`). For financial figures like currency and billing, `Decimal` represents numbers exact to a specified decimal point, ensuring calculation safety.

### 2. `String[]` (Scalar List)
```prisma
images  String[]
```
*   **Actual Meaning**: Direct representation of an array of strings (`TEXT[]` in PostgreSQL).
*   **Purpose**: Storing multiple product image URLs without needing to create a separate `Image` table, keeping our catalog structure efficient.

### 3. The `onDelete: Restrict` Referential Action
```prisma
category  Category @relation(fields: [categoryId], references: [id], onDelete: Restrict)
```
*   **Actual Meaning**: Instructs the database that if an attempt is made to delete a `Category` that still has any `Product` referencing its `id`, the database must raise a foreign-key error and prevent the delete.
*   **Purpose**: Protects catalog data integrity by preventing accidental deletion of categories (which would otherwise leave "orphaned" products without a category).

### 4. Review Relation to User and Product (Double Cascade Delete)
```prisma
user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
```
*   **Actual Meaning**: Both relationships are set to `onDelete: Cascade`.
*   **Purpose**: If a `User` accounts is deleted, or a `Product` listing is removed, their associated product `Review` feedback records no longer serve any purpose. Cascade delete automatically purges these linked records to keep our database clean.

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
3. **Verify Restrict Delete**:
   - Go to **Category** -> Create a Category (e.g., Name: "Electronics", Slug: "electronics"). Save it.
   - Go to **Product** -> Create a Product inside that category (fill in name, slug, price, and select the category). Save it.
   - Go back to the **Category** tab, select the category, and click **Delete 1 record** -> **Save 1 change**.
   - **Expected Behavior**: Prisma Studio throws a red error banner (`Foreign key constraint failed...`) and blocks the deletion because `onDelete: Restrict` is working!
4. **Verify Double Cascade Delete on Review**:
   - Go to **User** -> Create and save a User.
   - Go to **Review** -> Create and save a Review linked to both the User and Product.
   - Go to **Product** -> Delete the Product and save.
   - **Expected Behavior**: Go to the **Review** tab, and you will see the review has been automatically deleted by the database via Cascade delete!
