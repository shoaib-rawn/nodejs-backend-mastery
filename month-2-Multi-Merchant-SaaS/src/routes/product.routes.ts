import { Router } from 'express';
import { getProductById, getGlobalProducts } from '../controllers/product.controller';

const router = Router();

// ==========================================
// 📦 GLOBAL PRODUCT CATALOG ENDPOINTS
// ==========================================

// Get global products across all stores (Public endpoint with search, filtering & pagination)
router.get(
  '/',
  getGlobalProducts
);

// Get a single product details by ID (Public endpoint)
router.get(
  '/:id',
  getProductById
);

export default router;

