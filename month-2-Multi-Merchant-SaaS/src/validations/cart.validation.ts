import { z } from 'zod';

export const addToCartSchema = z.object({
  productId: z.coerce.number({
    required_error: 'Product ID is required',
    invalid_type_error: 'Product ID must be a number',
  }).int().positive(),
  quantity: z.coerce.number({
    invalid_type_error: 'Quantity must be a number',
  }).int().positive().default(1),
});

export const updateCartQuantitySchema = z.object({
  quantity: z.coerce.number({
    required_error: 'Quantity is required',
    invalid_type_error: 'Quantity must be a number',
  }).int().min(0, 'Quantity cannot be negative'),
});

export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type UpdateCartQuantityInput = z.infer<typeof updateCartQuantitySchema>;
