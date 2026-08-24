# Day 11 Challenge: Store & Product CRUD Validation

Today's challenge is to build a verification script that validates that Store and Product CRUD APIs, Zod schemas, and relational database constraints function properly.

---

## 🎯 Task Objective

Write a TypeScript validation script inside `activities/verify-day11.ts` that:

1.  **Validates Store Creation & Owner Linking:**
    *   Submits a `POST /api/v1/stores` payload with a unique slug as a Seller.
    *   Verifies that a `Store` record is created, and the user is atomically assigned as `OWNER` in the `StoreMember` table.
2.  **Validates Store Scoping:**
    *   Creates a test category inside this store.
    *   Submits a product payload containing `categoryId` and `storeId`.
    *   Asserts that the product is successfully created.
3.  **Validates Product Updates & Stock Levels:**
    *   Updates the product stock level to `120`.
    *   Retrieves the product details and asserts that the updated stock is returned correctly.
4.  **Validates Cascading Cleanup:**
    *   Deletes the product and the store.
    *   Verifies that all temporary records are deleted cleanly from the database.

---

## 🚦 Deliverables

1.  Create `activities/verify-day11.ts`.
2.  Run the verification script.
3.  Ensure that all tests output `✅ Success` labels.
