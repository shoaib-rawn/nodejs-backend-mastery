# Day 11: Store & Product Management CRUD APIs

Today, we implemented the central business models of our Multi-Merchant SaaS application: **Store** and **Product** Management CRUD APIs.

---

## 1. Multi-Tenant Architectural Bounds

When creating/editing stores and products, we enforce security boundaries:

1.  **Atomic Owner Association:** When a Seller creates a store, the API automatically links them as the `OWNER` inside the `StoreMember` table using Prisma nested writes.
2.  **Category Store Scoping:** When adding a product to Store A, we validate that the category (`categoryId`) belongs to Store A. This prevents catalog pollution where a merchant could use categories from a competitor's store.
3.  **Role Verification:**
    *   **Store Management:** Restricted to `OWNER` only.
    *   **Product Management:** Restricted to `OWNER` and `ADMIN` members of the store.

---

## 2. API Endpoints Reference

| Route | HTTP Method | Auth / Access | Description |
| :--- | :--- | :--- | :--- |
| `/api/v1/stores` | `POST` | protect, SELLER/ADMIN | Create a new merchant store. |
| `/api/v1/stores/:storeId` | `PUT` | protect, OWNER | Edit store details. |
| `/api/v1/stores/:storeId` | `DELETE` | protect, OWNER | Delete store. |
| `/api/v1/stores/:storeId/products` | `POST` | protect, OWNER/ADMIN | Add product to store. |
| `/api/v1/stores/:storeId/products` | `GET` | Public | List all store products. |
| `/api/v1/stores/:storeId/products/:id` | `PUT` | protect, OWNER/ADMIN | Edit product details. |
| `/api/v1/stores/:storeId/products/:id` | `DELETE` | protect, OWNER/ADMIN | Delete product from store. |
| `/api/v1/products/:id` | `GET` | Public | Fetch single product by ID. |

---

## 3. Data Integrity: Prisma Decimal Types

In PostgreSQL, prices are stored as `Decimal(10, 2)` to avoid floating-point binary errors (like `0.1 + 0.2 = 0.30000000000000004` which ruins financial audit trails).
In Prisma, we write decimal fields by passing an instance of `Prisma.Decimal`:

```typescript
import { Prisma } from '@prisma/client';

const product = await prisma.product.create({
  data: {
    price: new Prisma.Decimal(req.body.price),
    // ...
  }
});
```
This guarantees absolute accuracy during order checkout and sales calculations.
