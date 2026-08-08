import { Request, Response } from 'express';
import { prisma } from '../config/prisma.config';
import { z } from 'zod';
import { Prisma } from '@prisma/client';

// Input validation schemas
export const createProductSchema = z.object({
  name: z.string().min(2, 'Product name must be at least 2 characters.'),
  slug: z.string().min(2, 'Slug must be at least 2 characters.').regex(/^[a-z0-9-]+$/, 'Slug must only contain lowercase alphanumeric characters and dashes.'),
  description: z.string().min(5, 'Description must be at least 5 characters.'),
  price: z.union([z.string(), z.number()]).refine(val => {
    const num = Number(val);
    return !isNaN(num) && num > 0;
  }, 'Price must be a positive number.'),
  stock: z.number().int().nonnegative('Stock must be a non-negative integer.'),
  categoryId: z.number().int('Category ID must be an integer.'),
});

export const updateProductSchema = createProductSchema.partial();

/**
 * Creates a new Product under a specific Store.
 */
export async function createProduct(req: Request, res: Response) {
  try {
    const storeId = Number(req.params.storeId);
    if (isNaN(storeId)) {
      return res.status(400).json({ status: 'fail', message: 'Invalid Store ID.' });
    }

    // 1. Validate payload
    const parsed = createProductSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ status: 'fail', errors: parsed.error.format() });
    }

    const { name, slug, description, price, stock, categoryId } = parsed.data;

    // 2. Validate category existence and store scoping
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category || category.storeId !== storeId) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid Category: The specified category does not exist under this store.',
      });
    }

    // 3. Validate product slug uniqueness within this store
    const existingProduct = await prisma.product.findUnique({
      where: {
        storeId_slug: {
          storeId,
          slug,
        },
      },
    });

    if (existingProduct) {
      return res.status(400).json({
        status: 'fail',
        message: 'Product slug is already in use inside this store.',
      });
    }

    // 4. Create product
    const product = await prisma.product.create({
      data: {
        storeId,
        name,
        slug,
        description,
        price: new Prisma.Decimal(price),
        stock,
        categoryId,
      },
    });

    return res.status(201).json({
      status: 'success',
      product,
    });
  } catch (error: any) {
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to create product.',
    });
  }
}

/**
 * Recursively fetches a category ID and all its descendant category IDs.
 */
export async function getCategoryDescendants(categoryId: number): Promise<number[]> {
  const categoryIds: number[] = [categoryId];

  const children = await prisma.category.findMany({
    where: { parentId: categoryId },
    select: { id: true },
  });

  for (const child of children) {
    const childDescendants = await getCategoryDescendants(child.id);
    categoryIds.push(...childDescendants);
  }

  return categoryIds;
}

/**
 * Builds Prisma 'where' filter clause based on query parameters.
 */
async function buildProductWhereClause(query: any, baseWhere: Prisma.ProductWhereInput = {}): Promise<Prisma.ProductWhereInput> {
  const where: Prisma.ProductWhereInput = { ...baseWhere };

  // 1. Text Search (name or description)
  if (query.search) {
    const searchString = String(query.search);
    where.OR = [
      { name: { contains: searchString, mode: 'insensitive' } },
      { description: { contains: searchString, mode: 'insensitive' } },
    ];
  }

  // 2. Price Range Filter
  if (query.minPrice !== undefined || query.maxPrice !== undefined) {
    where.price = {};
    if (query.minPrice !== undefined && !isNaN(Number(query.minPrice))) {
      where.price.gte = new Prisma.Decimal(query.minPrice);
    }
    if (query.maxPrice !== undefined && !isNaN(Number(query.maxPrice))) {
      where.price.lte = new Prisma.Decimal(query.maxPrice);
    }
  }

  // 3. Category Filter with Recursive Descendant Expansion
  if (query.categoryId !== undefined && !isNaN(Number(query.categoryId))) {
    const rootCategoryId = Number(query.categoryId);
    const descendantIds = await getCategoryDescendants(rootCategoryId);
    where.categoryId = { in: descendantIds };
  }

  // 4. Stock Status Filter
  if (query.stockStatus) {
    if (query.stockStatus === 'in-stock') {
      where.stock = { gt: 0 };
    } else if (query.stockStatus === 'out-of-stock') {
      where.stock = { equals: 0 };
    }
  }

  return where;
}

/**
 * Determines sorting order object for Prisma queries.
 */
function buildProductOrderBy(sortBy?: string): Prisma.ProductOrderByWithRelationInput {
  switch (sortBy) {
    case 'price_asc':
      return { price: 'asc' };
    case 'price_desc':
      return { price: 'desc' };
    case 'name_asc':
      return { name: 'asc' };
    case 'name_desc':
      return { name: 'desc' };
    case 'createdAt_desc':
    default:
      return { createdAt: 'desc' };
  }
}

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

/**
 * Lists global products across all stores with advanced filtering, sorting, and pagination (Public).
 */
export async function getGlobalProducts(req: Request, res: Response) {
  try {
    // 1. Build Filter Conditions (Global platform scope)
    const where = await buildProductWhereClause(req.query);

    // 2. Build Sorting Order
    const orderBy = buildProductOrderBy(String(req.query.sortBy || 'createdAt_desc'));

    // 3. Parse Pagination Parameters
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    // 4. Execute Parallel Queries
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
      message: error.message || 'Failed to retrieve global products.',
    });
  }
}

/**
 * Returns a single Product by ID (Public).
 */
export async function getProductById(req: Request, res: Response) {
  try {
    const productId = Number(req.params.id);
    if (isNaN(productId)) {
      return res.status(400).json({ status: 'fail', message: 'Invalid Product ID.' });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        store: { select: { id: true, name: true, slug: true } },
        category: { select: { id: true, name: true, slug: true } },
      },
    });

    if (!product) {
      return res.status(404).json({ status: 'fail', message: 'Product not found.' });
    }

    return res.status(200).json({
      status: 'success',
      product,
    });
  } catch (error: any) {
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to retrieve product.',
    });
  }
}

/**
 * Updates a product details under a specific Store.
 */
export async function updateProduct(req: Request, res: Response) {
  try {
    const storeId = Number(req.params.storeId);
    const productId = Number(req.params.id);

    if (isNaN(storeId) || isNaN(productId)) {
      return res.status(400).json({ status: 'fail', message: 'Invalid ID parameters.' });
    }

    // 1. Validate payload
    const parsed = updateProductSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ status: 'fail', errors: parsed.error.format() });
    }

    const { name, slug, description, price, stock, categoryId } = parsed.data;

    // 2. Validate product ownership and existence
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct || existingProduct.storeId !== storeId) {
      return res.status(404).json({ status: 'fail', message: 'Product not found in this store.' });
    }

    // 3. Validate category boundaries
    if (categoryId !== undefined) {
      const category = await prisma.category.findUnique({ where: { id: categoryId } });
      if (!category || category.storeId !== storeId) {
        return res.status(400).json({ status: 'fail', message: 'Invalid Category for this store.' });
      }
    }

    // 4. Validate unique slug if updated
    if (slug && slug !== existingProduct.slug) {
      const slugTaken = await prisma.product.findUnique({
        where: { storeId_slug: { storeId, slug } },
      });
      if (slugTaken) {
        return res.status(400).json({ status: 'fail', message: 'Product slug is already in use.' });
      }
    }

    // 5. Update
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        slug,
        description,
        price: price !== undefined ? new Prisma.Decimal(price) : undefined,
        stock,
        categoryId,
      },
    });

    return res.status(200).json({
      status: 'success',
      product: updatedProduct,
    });
  } catch (error: any) {
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to update product.',
    });
  }
}

/**
 * Deletes a product from a specific Store.
 */
export async function deleteProduct(req: Request, res: Response) {
  try {
    const storeId = Number(req.params.storeId);
    const productId = Number(req.params.id);

    if (isNaN(storeId) || isNaN(productId)) {
      return res.status(400).json({ status: 'fail', message: 'Invalid ID parameters.' });
    }

    // 1. Verify existence and relation
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || product.storeId !== storeId) {
      return res.status(404).json({ status: 'fail', message: 'Product not found in this store.' });
    }

    // 2. Delete
    await prisma.product.delete({
      where: { id: productId },
    });

    return res.status(200).json({
      status: 'success',
      message: 'Product deleted successfully.',
    });
  } catch (error: any) {
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to delete product.',
    });
  }
}
