# 📘 Day 12 Code Notes: Advanced Product Filtering, Recursive Category Trees & Offset Pagination

> **Topic:** Day 12 - Product Search, Filtering, Sorting & Offset Pagination APIs  
> **Source Files:** `src/controllers/product.controller.ts`, `src/routes/product.routes.ts`, `activities/verify-day12.ts`

---

## 🎯 Key Concepts Covered

1. **Recursive Category Tree Traversal (`getCategoryDescendants`):**
   * Automatically queries parent-child category relationships in PostgreSQL.
   * When a customer filters by a top-level category like "Electronics", the query recursively aggregates child IDs ("Audio") and grandchild IDs ("Headphones"), ensuring products in subcategories are displayed.

2. **Multi-Field Dynamic Filtering (`buildProductWhereClause`):**
   * **Case-Insensitive Text Search:** Uses `mode: 'insensitive'` on product `name` and `description`.
   * **Price Bounds:** Validates `minPrice` and `maxPrice` parameters, mapping them to `Prisma.Decimal` instances.
   * **Stock Status:** Filters by `in-stock` (`stock > 0`) or `out-of-stock` (`stock === 0`).

3. **Flexible Query Sorting (`buildProductOrderBy`):**
   * Supports `price_asc`, `price_desc`, `name_asc`, `name_desc`, and defaults to `createdAt_desc`.

4. **Offset Pagination Calculations:**
   * Formula: `skip = (page - 1) * limit`.
   * Metadata: `totalPages = Math.ceil(total / limit)`.
   * Parallel query execution via `Promise.all([prisma.product.count({ where }), prisma.product.findMany(...)])`.

---

## 💻 Source Code Snippets & Commentary

### 1. Recursive Category Traversal Helper (`src/controllers/product.controller.ts`)
```typescript
/**
 * Recursively fetches a category ID and all its descendant category IDs.
 */
export async function getCategoryDescendants(categoryId: number): Promise<number[]> {
  const categoryIds: number[] = [categoryId];

  // Fetch direct children categories
  const children = await prisma.category.findMany({
    where: { parentId: categoryId },
    select: { id: true },
  });

  // Recursively fetch descendants for each child
  for (const child of children) {
    const childDescendants = await getCategoryDescendants(child.id);
    categoryIds.push(...childDescendants);
  }

  return categoryIds;
}
```

### 2. Multi-Filter & Search Handler (`src/controllers/product.controller.ts`)
```typescript
/**
 * Lists products belonging to a specific Store with advanced filtering, sorting, and pagination (Public).
 */
export async function getStoreProducts(req: Request, res: Response) {
  try {
    const storeId = Number(req.params.storeId);
    if (isNaN(storeId)) {
      return res.status(400).json({ status: 'fail', message: 'Invalid Store ID.' });
    }

    // 1. Build Filter Conditions
    const where = await buildProductWhereClause(req.query, { storeId });

    // 2. Build Sorting Order
    const orderBy = buildProductOrderBy(String(req.query.sortBy || 'createdAt_desc'));

    // 3. Parse Pagination Parameters
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    // 4. Execute Parallel Queries (Total Count + Paginated Products)
    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          category: {
            select: { id: true, name: true, slug: true },
          },
          store: {
            select: { id: true, name: true, slug: true },
          },
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return res.status(200).json({
      status: 'success',
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
      results: products.length,
      products,
    });
  } catch (error: any) {
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to retrieve products.',
    });
  }
}
```

---

## 🧪 Verification Output
```bash
npx ts-node activities/verify-day12.ts
```
```text
🚀 Starting Day 12 Automated Verification Script...
📦 Step 1: Setting up mock User, Store, and Category Tree...
🛒 Step 2: Creating mock products across category tree levels...
🔍 Step 3: Testing Category Tree Recursive Filtering...
   - Querying Parent Category 'Electronics' (ID: 1).
   - Expected: 3 products (including child & grandchild categories).
   - Received: 3 products.
   ✅ Recursive Category Tree filtering PASSED!
💰 Step 4: Testing Price Range & Stock Status Filters...
   - Querying minPrice=100 & maxPrice=500 & stockStatus=in-stock...
   - Received: 2 products.
   ✅ Price & Stock filtering PASSED!
📊 Step 5: Testing Sorting & Offset Pagination...
   - Querying page=1, limit=2, sortBy=price_asc...
   - Total Count: 3
   - Total Pages: 2
   - First Item Price: $150
   ✅ Sorting & Pagination PASSED!
🌐 Step 6: Testing Global Product Catalog Search...
   - Global Search Query: search=headset
   - Received: 1 matching products.
   ✅ Global Search PASSED!
🧹 Step 7: Cleaning up mock verification data...

🎉 ALL DAY 12 VERIFICATION TESTS PASSED SUCCESSFULLY! 🎉
```
