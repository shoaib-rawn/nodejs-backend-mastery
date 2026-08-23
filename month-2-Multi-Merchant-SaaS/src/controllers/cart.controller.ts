import { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/errorHandler.js';
import {
  addToCartService,
  getCartService,
  updateCartItemQuantityService,
  removeCartItemService,
  clearCartService
} from '../services/cart.service.js';

export const addToCart = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const storeId = parseInt(req.params.storeId, 10);
  const { productId, quantity } = req.body;

  const result = await addToCartService(userId, storeId, productId, quantity);
  res.status(201).json({
    status: 'success',
    message: 'Item added to cart',
    data: result
  });
});

export const getCart = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const storeId = parseInt(req.params.storeId, 10);

  const result = await getCartService(userId, storeId);
  res.status(200).json({
    status: 'success',
    data: result
  });
});

export const updateCartItemQuantity = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const storeId = parseInt(req.params.storeId, 10);
  const cartItemId = parseInt(req.params.cartItemId, 10);
  const { quantity } = req.body;

  const result = await updateCartItemQuantityService(userId, storeId, cartItemId, quantity);
  res.status(200).json({
    status: 'success',
    data: result
  });
});

export const removeCartItem = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const storeId = parseInt(req.params.storeId, 10);
  const cartItemId = parseInt(req.params.cartItemId, 10);

  const result = await removeCartItemService(userId, storeId, cartItemId);
  res.status(200).json({
    status: 'success',
    data: result
  });
});

export const clearCart = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const storeId = parseInt(req.params.storeId, 10);

  const result = await clearCartService(userId, storeId);
  res.status(200).json({
    status: 'success',
    data: result
  });
});
