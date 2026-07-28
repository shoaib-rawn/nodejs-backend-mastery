# Day 07 Challenge: Multi-Tenant Database Verification

Today's challenge is to write a verification script using the Prisma Client to programmatically inspect the database and verify that our new **Multi-Merchant SaaS** structural rules are operating correctly.

---

## 🎯 Task Objective

Write a TypeScript validation script inside `activities/verify-seed.ts` that query-tests the database and logs the results to the terminal. The script must verify:

1.  **Multi-Tenancy Isolation:** Query and log all `Stores` and confirm that we have seeded exactly **3 stores**.
2.  **Category Hierarchies (Self-Referential 1:N):** Query the category named `"Laptops"` and print its parent category name (which must be `"Electronics"`).
3.  **Related Product Bundles (Self-Referential N:M):** Query `"MacBook Pro 16-inch M3"` and display the names of its recommended/related products (which should include the `"MX Master 3S Wireless Mouse"`).
4.  **Store-Scoped Sequences:** Query orders with `orderNumber = 1` and print which store each order belongs to. Validate that we have orders with the same `orderNumber` belonging to different stores, demonstrating sequence isolation.

---

## 🚦 Deliverables

1.  Create `activities/verify-seed.ts` containing the database inspection queries.
2.  Run the verification script using `ts-node`.
3.  Ensure your terminal logs match the validation goals perfectly.
