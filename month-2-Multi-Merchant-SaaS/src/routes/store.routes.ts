import { Router } from 'express';
import { protect, authorizePlatformRoles, authorizeStoreRoles } from '../middlewares/auth.middleware';
import { createStore, updateStore, deleteStore } from '../controllers/store.controller';
import { createProduct, getStoreProducts, updateProduct, deleteProduct, uploadProductImages, deleteProductImage } from '../controllers/product.controller';
import { upload } from '../middlewares/upload.middleware';

const router = Router();

// ==========================================
// 🏬 STORE CRUD ENDPOINTS
// ==========================================

// Create Store (restricted to Sellers and Admins)
router.post(
  '/',
  protect,
  authorizePlatformRoles('SELLER', 'ADMIN'),
  createStore
);

// Update Store (restricted to Store Owners)
router.put(
  '/:storeId',
  protect,
  authorizeStoreRoles('OWNER'),
  updateStore
);

// Delete Store (restricted to Store Owners)
router.delete(
  '/:storeId',
  protect,
  authorizeStoreRoles('OWNER'),
  deleteStore
);

// ==========================================
// 📦 STORE PRODUCTS CRUD ENDPOINTS
// ==========================================

// Create Product inside a Store (Store Owners & Admins)
router.post(
  '/:storeId/products',
  protect,
  authorizeStoreRoles('OWNER', 'ADMIN'),
  createProduct
);

// List Products for a Store (Public endpoint)
router.get(
  '/:storeId/products',
  getStoreProducts
);

// Update Product inside a Store (Store Owners & Admins)
router.put(
  '/:storeId/products/:id',
  protect,
  authorizeStoreRoles('OWNER', 'ADMIN'),
  updateProduct
);

// Delete Product from a Store (Store Owners & Admins)
router.delete(
  '/:storeId/products/:id',
  protect,
  authorizeStoreRoles('OWNER', 'ADMIN'),
  deleteProduct
);

// ==========================================
// 🖼️ PRODUCT IMAGES ENDPOINTS
// ==========================================

// Upload Product Images (Store Owners & Admins, max 5 images)
router.post(
  '/:storeId/products/:id/images',
  protect,
  authorizeStoreRoles('OWNER', 'ADMIN'),
  upload.array('images', 5),
  uploadProductImages
);

// Delete Product Image (Store Owners & Admins)
router.delete(
  '/:storeId/products/:id/images',
  protect,
  authorizeStoreRoles('OWNER', 'ADMIN'),
  deleteProductImage
);

export default router;
