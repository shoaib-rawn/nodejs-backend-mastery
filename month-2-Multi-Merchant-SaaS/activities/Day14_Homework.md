# Day 14 Challenge: Multi-Tenant Shopping Cart Engine

## Objective
Build and test persistent shopping cart management endpoints for a multi-tenant SaaS application using Express, Zod, and Prisma ORM.

## Requirements
1. Define Zod validation schemas for adding items and updating quantities.
2. Implement `addToCartService` that upserts cart items (increments quantity if already in cart).
3. Validate product stock limits before adding or updating items.
4. Implement tenant cart aggregation calculating `totalItems` and `subtotal` formatted to 2 decimal places.
5. Create routes under `/api/v1/stores/:storeId/cart` guarded by JWT authentication.
