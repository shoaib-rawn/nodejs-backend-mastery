# Day 14: Multi-Tenant Shopping Cart Management API

## Overview & Architecture
The Multi-Tenant Shopping Cart API allows authenticated users to maintain persistent, isolated shopping carts across different merchant store tenants. Carts automatically increment product quantities when existing items are added again, enforce stock availability limits, compute tenant subtotals dynamically, and support item updates and clearing.

---

## 🛠️ API Endpoints Summary

| Method | Endpoint | Auth | Role | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/stores/:storeId/cart` | JWT | Any User | Fetch current user's cart & calculated totals for target store |
| `POST` | `/api/v1/stores/:storeId/cart` | JWT | Any User | Add item to cart (or increment quantity if already exists) |
| `PATCH` | `/api/v1/stores/:storeId/cart/:cartItemId` | JWT | Any User | Update cart item quantity |
| `DELETE` | `/api/v1/stores/:storeId/cart/:cartItemId` | JWT | Any User | Remove specific item from cart |
| `DELETE` | `/api/v1/stores/:storeId/cart` | JWT | Any User | Clear entire cart for store tenant |

---

## 💻 Source Code Walkthrough

### 1. `CartItem` Model (`prisma/schema.prisma`)
```prisma
model CartItem {
  id        Int      @id @default(autoincrement())
  userId    Int
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  productId Int
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  quantity  Int      @default(1)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([userId, productId])
}
```

### 2. Cart Service Business Logic (`src/services/cart.service.ts`)
```typescript
export async function addToCartService(userId: number, storeId: number, productId: number, quantity: number) {
  const product = await prisma.product.findFirst({ where: { id: productId, storeId } });
  if (!product) throw new AppError('Product not found in this store tenant', 404);
  if (product.stock < quantity) throw new AppError(`Insufficient stock. Available: ${product.stock}`, 400);

  const existingCartItem = await prisma.cartItem.findUnique({
    where: { userId_productId: { userId, productId } }
  });

  if (existingCartItem) {
    const newQuantity = existingCartItem.quantity + quantity;
    if (product.stock < newQuantity) throw new AppError('Exceeds available stock', 400);
    return await prisma.cartItem.update({
      where: { id: existingCartItem.id },
      data: { quantity: newQuantity }
    });
  }

  return await prisma.cartItem.create({ data: { userId, productId, quantity } });
}
```

---

## ⚡ Verification & Testing
Ran automated verification test script `verify-day14.ts` testing addition, stock boundary enforcement, quantity incrementing, subtotals calculation, item removal, and full cart clearing. All tests passed 100%!
