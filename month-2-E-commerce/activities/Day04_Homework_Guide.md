# Month 2 Day 04 Homework Guide: Solution & Implementation Walkthrough

This guide walks you through the step-by-step solution to the Day 04 Homework Challenge.

---

## 🛠️ Step 1: Extended Prisma Schema

Here is the completed schema code that includes the address fields in the `Profile` model, with detailed comments explaining each field:

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
```

---

## 🛠️ Step 2: Database Schema Synchronization

To sync the address schema extensions with your local database and update your local types, run:
```bash
npx prisma db push
```

This updates your PostgreSQL schema and regenerates the Prisma Client types.

---

## 🛠️ Step 3: Verifying Relationships in Prisma Studio

Instead of maintaining a complex temporary scratch script, use **Prisma Studio** for easy verification.

1. **Start the Studio GUI**:
   ```bash
   npx prisma studio
   ```
2. **Access the Interface**:
   Open **`http://localhost:5555`** in your browser.
3. **Create the User (Parent Row)**:
   - Navigate to the **User** model.
   - Click **Add record**, enter the `email`, `password`, and choose the `Role` (e.g., `CUSTOMER` or `ADMIN`).
   - **Crucial**: Click **Save 1 change** first. Since `id` is auto-incremented, the user must be committed to the database so it gets assigned an ID.
4. **Create the Profile & Link It**:
   - Navigate to the **Profile** model.
   - Click **Add record** and fill in `firstName`, `lastName`, and the address fields you added (`street`, `city`, `postalCode`, `country`).
   - Double-click the `userId` / `user` column, search for the User ID you created, and select it.
   - Click **Save 1 change**.
5. **Verify Cascade Delete**:
   - Go back to the **User** model.
   - Select the checkbox next to the User record you just created.
   - Click **Delete 1 record** and click **Save 1 change** at the bottom.
   - Return to the **Profile** model: the associated profile will have disappeared, verifying that database-level **Cascade Delete** works perfectly!

