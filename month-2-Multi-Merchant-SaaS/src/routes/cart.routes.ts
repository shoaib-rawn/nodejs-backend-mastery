import { Router } from 'express';
import { authenticate } from '../middlewares/auth.js';
import { validateRequest } from '../middlewares/validate.js';
import { addToCartSchema, updateCartQuantitySchema } from '../validations/cart.validation.js';
import {
  addToCart,
  getCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCart
} from '../controllers/cart.controller.js';

const router = Router({ mergeParams: true });

// Protect all cart routes with JWT authentication
router.use(authenticate);

router.route('/')
  .get(getCart)
  .post(validateRequest(addToCartSchema), addToCart)
  .delete(clearCart);

router.route('/:cartItemId')
  .patch(validateRequest(updateCartQuantitySchema), updateCartItemQuantity)
  .delete(removeCartItem);

export default router;
