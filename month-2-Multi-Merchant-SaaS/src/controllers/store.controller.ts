import { Response } from 'express';
import { prisma } from '../config/prisma.config';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { z } from 'zod';

// Input validation schemas
export const createStoreSchema = z.object({
  name: z.string().min(2, 'Store name must be at least 2 characters.'),
  slug: z.string().min(2, 'Slug must be at least 2 characters.').regex(/^[a-z0-9-]+$/, 'Slug must only contain lowercase alphanumeric characters and dashes.'),
  description: z.string().optional(),
});

export const updateStoreSchema = z.object({
  name: z.string().min(2, 'Store name must be at least 2 characters.').optional(),
  description: z.string().optional(),
});

/**
 * Creates a new merchant Store and assigns the creator as the OWNER.
 */
export async function createStore(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ status: 'fail', message: 'Access Denied: Log in first.' });
    }

    // 1. Validate payload
    const parsed = createStoreSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ status: 'fail', errors: parsed.error.format() });
    }

    const { name, slug, description } = parsed.data;

    // 2. Validate slug uniqueness
    const existingStore = await prisma.store.findUnique({ where: { slug } });
    if (existingStore) {
      return res.status(400).json({ status: 'fail', message: 'Slug is already in use.' });
    }

    // 3. Atomically create Store and assign creator as Owner
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
      include: {
        members: true,
      },
    });

    return res.status(201).json({
      status: 'success',
      store,
    });
  } catch (error: any) {
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to create store.',
    });
  }
}

/**
 * Updates details of an existing Store.
 */
export async function updateStore(req: AuthenticatedRequest, res: Response) {
  try {
    const storeId = Number(req.params.storeId);
    if (isNaN(storeId)) {
      return res.status(400).json({ status: 'fail', message: 'Invalid Store ID.' });
    }

    // 1. Validate payload
    const parsed = updateStoreSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ status: 'fail', errors: parsed.error.format() });
    }

    const { name, description } = parsed.data;

    // 2. Update store
    const store = await prisma.store.update({
      where: { id: storeId },
      data: {
        name,
        description,
      },
    });

    return res.status(200).json({
      status: 'success',
      store,
    });
  } catch (error: any) {
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to update store.',
    });
  }
}

/**
 * Deletes a Store and cascade-deletes members/products.
 */
export async function deleteStore(req: AuthenticatedRequest, res: Response) {
  try {
    const storeId = Number(req.params.storeId);
    if (isNaN(storeId)) {
      return res.status(400).json({ status: 'fail', message: 'Invalid Store ID.' });
    }

    // Delete the store from database
    await prisma.store.delete({
      where: { id: storeId },
    });

    return res.status(200).json({
      status: 'success',
      message: 'Store deleted successfully.',
    });
  } catch (error: any) {
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to delete store.',
    });
  }
}
