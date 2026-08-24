# Day 10 Challenge: RBAC & Tenant Authentication Validation

Today's challenge is to build a verification script that validates that both Platform-level and Tenant-level RBAC middlewares are functioning correctly.

---

## 🎯 Task Objective

Write a TypeScript validation script inside `activities/verify-day10.ts` that accomplishes the following:

1.  **Assert Platform-Level Access Control:**
    *   Load a user with the `CUSTOMER` role (`buyer1@gmail.com`).
    *   Pass this customer user object to the `authorizePlatformRoles('ADMIN')` middleware.
    *   Assert that the middleware returns a `403 Forbidden` response and blocks execution.
2.  **Assert Tenant-Level Multi-Tenancy Boundary:**
    *   Pass the same customer user object to the `authorizeStoreRoles('OWNER', 'ADMIN')` middleware for Store 1 (`TechWorld Store`).
    *   Since they are not a member of the store, assert that the middleware returns a `403 Forbidden` response and blocks execution.
3.  **Assert Tenant-Level Insufficient Role:**
    *   Load a user with the `SELLER` role who is a `STAFF` member of Store 1 (`staff@techworld.com`).
    *   Pass this staff user object to the `authorizeStoreRoles('OWNER')` middleware for Store 1.
    *   Assert that the middleware returns a `403 Forbidden` response.
4.  **Assert Tenant-Level Sufficient Role:**
    *   Pass the same staff user object to the `authorizeStoreRoles('OWNER', 'ADMIN', 'STAFF')` middleware for Store 1.
    *   Assert that the middleware allows access and calls the `next()` callback with a `200 Success` status.

---

## 🚦 Deliverables

1.  Create `activities/verify-day10.ts`.
2.  Run the verification script.
3.  Ensure your terminal logs report that all tests passed successfully.
