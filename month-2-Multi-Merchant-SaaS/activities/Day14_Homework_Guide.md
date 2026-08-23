# Day 14 Homework Guide: Step-by-Step Implementation

## Step 1: Create Validation Schemas (`src/validations/cart.validation.ts`)
```typescript
import { z } from 'zod';

export const addToCartSchema = z.object({
  productId: z.coerce.number().int().positive(),
  quantity: z.coerce.number().int().positive().default(1),
});
```
* **Line 4:** `z.coerce.number()`: Converts incoming payload strings into numbers.
* **Line 5:** `positive().default(1)`: Enforces minimum quantity of 1.

## Step 2: Implement Cart Service (`src/services/cart.service.ts`)
```typescript
export async function getCartService(userId: number, storeId: number) {
  const items = await prisma.cartItem.findMany({
    where: { userId, product: { storeId } },
    include: { product: true }
  });

  let subtotal = 0;
  let totalItems = 0;

  const formattedItems = items.map(item => {
    const itemSubtotal = Number(item.product.price) * item.quantity;
    subtotal += itemSubtotal;
    totalItems += item.quantity;
    return { ...item, itemSubtotal };
  });

  return { storeId, totalItems, subtotal, items: formattedItems };
}
```
* **Line 3:** `where: { userId, product: { storeId } }`: Scopes cart query to target user AND target merchant store tenant.
* **Line 11-13:** Iterates through cart items to aggregate total items and total cost subtotal.

## Step 3: Register Routes (`src/routes/cart.routes.ts`)
```typescript
const router = Router({ mergeParams: true });
router.use(authenticate);
router.route('/').get(getCart).post(validateRequest(addToCartSchema), addToCart).delete(clearCart);
```
* **Line 1:** `mergeParams: true`: Allows accessing `:storeId` route parameters from parent Express app routers.
