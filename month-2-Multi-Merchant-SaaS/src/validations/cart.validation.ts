import { z } from 'zod';

export const addToCartSchema = z.object({
  productId: z.coerce.number().int('Product ID must be an integer').positive('Product ID must be positive'),
  quantity: z.coerce.number().int('Quantity must be an integer').positive('Quantity must be positive').default(1),
});

export const updateCartQuantitySchema = z.object({
  quantity: z.coerce.number().int('Quantity must be an integer').min(0, 'Quantity cannot be negative'),
});

export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type UpdateCartQuantityInput = z.infer<typeof updateCartQuantitySchema>;
