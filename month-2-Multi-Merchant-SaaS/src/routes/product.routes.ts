import { Router } from 'express';
import { getProductById } from '../controllers/product.controller';

const router = Router();

// ==========================================
// 📦 GLOBAL PRODUCT CATALOG ENDPOINTS
// ==========================================

// Get a single product details by ID (Public endpoint)
router.get(
  '/:id',
  getProductById
);

export default router;
