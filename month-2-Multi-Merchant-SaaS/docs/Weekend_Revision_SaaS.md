# 🚀 Month 2 SaaS Architecture: Weekend Revision Cheat Sheet

This self-contained guide summarizes the 4 core concepts of Multi-Merchant SaaS security, architecture, and database operations. Use this single file to revise both the theory and the corresponding code implementation.

---

## 🔒 1. JWT Refresh Token Rotation (RTR) & Security

### The Theory
*   **Access Token:** Short-lived (15 mins) token stored in memory by the client. Used for immediate API authorization.
*   **Refresh Token:** Long-lived (7 days) token stored in a database and sent inside secure, **`HttpOnly`** cookies to prevent access by malicious JavaScript (XSS protection).
*   **Refresh Token Rotation (RTR):** Every time a refresh token is used, it is deleted from the database and a new token pair is generated.
*   **Token Reuse (Theft) Detection:** If a token is reused (e.g. by an attacker who stole a used token), the database will not find the active record. The server flags this as a compromise and immediately **deletes all active tokens** for that user, logging them out of all devices.

### The Code Implementation
```typescript
// Token Rotation & Compromise Detection logic inside auth.controller.ts
export async function refreshAccessToken(req: Request, res: Response) {
  const incomingRefreshToken = req.cookies.refreshToken;
  if (!incomingRefreshToken) return res.status(401).json({ message: 'No token' });

  // 1. Verify token signature
  const decoded = jwt.verify(incomingRefreshToken, env.JWT_REFRESH_SECRET);

  // 2. Query database for token
  const storedToken = await prisma.refreshToken.findUnique({
    where: { token: incomingRefreshToken }
  });

  // 🛍️ COMPROMISE DETECTION
  if (!storedToken) {
    // If the token is valid but NOT in our DB, it has been reused (stolen).
    // Wipe all active sessions for this user!
    await prisma.refreshToken.deleteMany({
      where: { userId: decoded.userId }
    });
    res.clearCookie('refreshToken');
    return res.status(403).json({ message: 'Compromise detected. Please login again.' });
  }

  // 🔄 ROTATION: Generate new pair
  const newAccessToken = generateAccessToken(decoded.userId);
  const newRefreshToken = generateRefreshToken(decoded.userId);

  // Update DB atomically
  await prisma.$transaction([
    prisma.refreshToken.delete({ where: { id: storedToken.id } }),
    prisma.refreshToken.create({ data: { token: newRefreshToken, userId: decoded.userId } })
  ]);

  // Send new refresh token in HttpOnly Cookie
  res.cookie('refreshToken', newRefreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
  });

  return res.json({ accessToken: newAccessToken });
}
```

---

## 🏢 2. Tenant-Level Role-Based Access Control (RBAC)

### The Theory
*   **Platform Roles:** Global configurations for the entire platform (`ADMIN`, `CUSTOMER`, `SELLER`).
*   **Store Roles:** Local permissions scoped within a specific store/tenant (`OWNER`, `STAFF`).
*   **Compound DB Querying:** Instead of loading all store memberships, we query using Prisma's composite unique index `storeId_userId` to determine store authorization within sub-milliseconds.
*   **Bypass Rule:** Global Platform `ADMIN`s bypass local store checks for operational support.

### The Code Implementation
```typescript
// authorizeStoreRoles Middleware Factory inside auth.middleware.ts
export function authorizeStoreRoles(...allowedStoreRoles: string[]) {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    // 1. Resolve store context from request parameter
    const storeId = Number(req.params.storeId || req.body.storeId);
    if (isNaN(storeId)) return res.status(400).json({ message: 'Invalid Store ID' });

    // 🌟 Platform ADMIN Bypass Rule
    if (req.user.role === 'ADMIN') return next();

    // 2. Compound unique query to fetch specific store membership
    const membership = await prisma.storeMember.findUnique({
      where: {
        storeId_userId: {
          storeId,
          userId: req.user.id
        }
      }
    });

    // 3. Assert membership existence and check allowed roles
    if (!membership || !allowedStoreRoles.includes(membership.role)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient store privileges.' });
    }

    next(); // Pass control to the next handler
  };
}
```

---

## 📦 3. Relational Schema Isolation & Scoping

### The Theory
*   **Tenant Isolation:** Multi-merchant SaaS applications must keep catalog URLs isolated. We enforce `@@unique([storeId, slug])` so that different stores can list products with the same URL slug (e.g. both Store A and Store B can have `/products/iphone-15`).
*   **Self-Referential Category Tree:** Categories are modeled with a parent-child relationship within the same database table, allowing nested taxonomies (e.g., Electronics ➔ Laptops ➔ Gaming Laptops).

### The Prisma Schema
```prisma
// schema.prisma snippet for Product Isolation
model Product {
  id          Int      @id @default(autoincrement())
  storeId     Int
  store       Store    @relation(fields: [storeId], references: [id], onDelete: Cascade)
  slug        String
  categoryId  Int
  category    Category @relation(fields: [categoryId], references: [id], onDelete: Restrict)
  // ...
  
  @@unique([storeId, slug]) // Product slug must be unique ONLY inside the same store
}

// schema.prisma snippet for Self-Referential Category Trees
model Category {
  id          Int        @id @default(autoincrement())
  storeId     Int
  name        String
  parentId    Int?
  parent      Category?  @relation("SubCategories", fields: [parentId], references: [id], onDelete: Cascade)
  children    Category[] @relation("SubCategories")
  // ...
}
```

---

## 💰 4. Data Integrity & Transactions

### The Theory
*   **Decimal vs Float:** Floating-point data types use binary numbers to approximate decimals. This introduces calculation errors (like `0.1 + 0.2 = 0.30000000000000004`). We store prices as PostgreSQL `Decimal` types and write them in Prisma using `Prisma.Decimal` to ensure absolute transaction accuracy.
*   **Prisma Nested Writes:** Atomic transactions that ensure a parent and child record are created together. E.g. creating a Store and adding the creator to the StoreMember table simultaneously. If one fails, the whole operation rolls back.

### The Code Implementation
```typescript
// Atomic nested write & Decimal price formatting
export async function createStore(req: AuthenticatedRequest, res: Response) {
  const { name, slug, description } = req.body;

  // Atomically create Store and link creator as OWNER in a single database step
  const store = await prisma.store.create({
    data: {
      name,
      slug,
      description,
      ownerId: req.user!.id,
      members: {
        create: {
          userId: req.user!.id,
          role: 'OWNER', // Assigned as OWNER atomically
        }
      }
    }
  });

  return res.status(201).json({ store });
}

// Handling Decimal values when creating a Product
export async function createProduct(req: Request, res: Response) {
  const { name, slug, description, price, stock, categoryId } = req.body;

  const product = await prisma.product.create({
    data: {
      storeId: Number(req.params.storeId),
      name,
      slug,
      description,
      price: new Prisma.Decimal(price), // Converts string/number to arbitrary-precision Decimal
      stock,
      categoryId
    }
  });

  return res.status(201).json({ product });
}
```
