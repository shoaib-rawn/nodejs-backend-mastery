# Day 11 Solution Guide: Store & Product CRUD Validation

This guide explains how to complete the Day 11 verification challenge.

---

## Step 1: Create the Verification Script

Create [activities/verify-day11.ts](file:///d:/anti/month-2-Multi-Merchant-SaaS/activities/verify-day11.ts) containing:

```typescript
import { prisma } from '../src/config/prisma.config';
import { createStore, updateStore, deleteStore } from '../src/controllers/store.controller';
import { createProduct, getStoreProducts, getProductById, updateProduct, deleteProduct } from '../src/controllers/product.controller';
import { Response } from 'express';

async function runTests() {
  console.log('🧪 Starting Day 11 Store & Product CRUD checks...\n');

  // Load a test owner (SELLER) user
  const seller = await prisma.user.findUnique({ where: { email: 'owner@techworld.com' } });
  if (!seller) {
    console.error('❌ Test seller not found!');
    return;
  }

  function createMockResponse() {
    return {
      statusCode: 200,
      body: null,
      status(code: number) { this.statusCode = code; return this; },
      json(data: any) { this.body = data; return this; }
    } as any;
  }

  let createdStoreId: number | null = null;
  let createdCategoryId: number | null = null;
  let createdProductId: number | null = null;

  // 1. Create Store & Auto-Owner Assignment
  const uniqueSlug = `test-store-${Date.now()}`;
  const req1 = { user: seller, body: { name: 'Dynamic Test Store', slug: uniqueSlug, description: 'Desc' } } as any;
  const res1 = createMockResponse();
  await createStore(req1, res1);

  if (res1.statusCode === 201 && res1.body?.store) {
    createdStoreId = res1.body.store.id;
    const ownerMember = res1.body.store.members.find((m: any) => m.userId === seller.id);
    if (ownerMember && ownerMember.role === 'OWNER') {
      console.log('✅ Store Created & Owner Associated.\n');
    }
  }

  // 2. Add Category
  const tempCategory = await prisma.category.create({
    data: { storeId: createdStoreId!, name: 'Electronics Test', slug: `electronics-test-${Date.now()}` }
  });
  createdCategoryId = tempCategory.id;

  // 3. Create Product
  const req3 = {
    params: { storeId: String(createdStoreId) },
    body: { name: 'Super Gadget V1', slug: `gadget-${Date.now()}`, description: 'Desc info', price: '199.99', stock: 25, categoryId: createdCategoryId }
  } as any;
  const res3 = createMockResponse();
  await createProduct(req3, res3);
  if (res3.statusCode === 201 && res3.body?.product) {
    createdProductId = res3.body.product.id;
    console.log('✅ Product Created.\n');
  }

  // 4. Cleanup
  await prisma.product.delete({ where: { id: createdProductId! } });
  await prisma.store.delete({ where: { id: createdStoreId! } });
  console.log('✅ Cleanup completed.\n');
}

runTests();
```

---

## Code & Logic Explanation

### 1. Atomic Nested Creates
```typescript
const store = await prisma.store.create({
  data: {
    name,
    slug,
    description,
    ownerId: req.user.id,
    members: {
      create: {
        userId: req.user.id,
        role: 'OWNER',
      },
    },
  },
});
```
*   **The Concept:** Prisma nested write allows creating a record (`Store`) and linking related records (`StoreMember`) in a single query.
*   **The Benefit:** It prevents database anomalies. If the store is successfully created but the process crashes before adding the user to the members table, the store would be left orphaned. A nested create executes inside a database transaction, guaranteeing both occur or both fail.

### 2. Prisma Decimal Precision
```typescript
price: new Prisma.Decimal(price),
```
*   **The Concept:** Price values in JavaScript are float types which are binary approximations. Prisma converts JavaScript floating numbers or strings into the arbitrary-precision `Prisma.Decimal` type.
*   **The Benefit:** Prevents rounding errors during checkout computations.

---

## Step 2: Run the Verification

Run the verification:

```bash
npx ts-node activities/verify-day11.ts
```
Verify that the output console shows all tasks completed.
