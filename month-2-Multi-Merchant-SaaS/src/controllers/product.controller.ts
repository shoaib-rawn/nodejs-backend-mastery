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
 * Lists all products belonging to a Store (Public).
 */
export async function getStoreProducts(req: Request, res: Response) {
  try {
    const storeId = Number(req.params.storeId);
    if (isNaN(storeId)) {
      return res.status(400).json({ status: 'fail', message: 'Invalid Store ID.' });
    }

    const products = await prisma.product.findMany({
      where: { storeId },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    return res.status(200).json({
      status: 'success',
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
