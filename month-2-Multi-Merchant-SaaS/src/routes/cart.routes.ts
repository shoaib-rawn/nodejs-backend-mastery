import { Router } from 'express';
import { protect } from '../middlewares/auth.middleware';
import {
  addToCart,
  getCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCart
} from '../controllers/cart.controller';

const router = Router({ mergeParams: true });

// Protect all cart routes with JWT authentication
router.use(protect);

router.route('/')
  .get(getCart)
  .post(addToCart)
  .delete(clearCart);

router.route('/:cartItemId')
  .patch(updateCartItemQuantity)
  .delete(removeCartItem);

export default router;
