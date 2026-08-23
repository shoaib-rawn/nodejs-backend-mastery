# 📝 Day 08 - Day 11 Code Walkthrough Notes

This document contains the complete, exact source code of all core configuration files, controllers, and middlewares implemented from **Day 08 to Day 11**. Every single block of code is annotated with line-by-line comments explaining how it functions in our Multi-Merchant SaaS application.

---

## 🛠️ 1. Day 08: Environment Variable Validation

### File: [src/config/env.ts](file:///d:/anti/month-2-Multi-Merchant-SaaS/src/config/env.ts)
```typescript
import { z } from 'zod';
import dotenv from 'dotenv';

// 1. Load variables from the local .env file into process.env
dotenv.config();

// 2. Define the exact shape and data types of your environment variables using Zod
const envSchema = z.object({
  // coerce.number() converts string values like "5000" from process.env into a standard JS number
  PORT: z.coerce.number().default(5000), 
  
  // Enforce specific environment enums with a default fallback
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  
  // Validates that the database connection string is a formatted URL (must start with postgresql://, mysql://, etc.)
  DATABASE_URL: z.string().url(), 
  
  // Validates that security keys are present and meet minimum length constraints to prevent weak developer keys
  JWT_SECRET: z.string().min(8), 
  JWT_REFRESH_SECRET: z.string().min(8),
});

// 3. Perform the parsing safely to prevent runtime exceptions from aborting immediately
const parsedEnv = envSchema.safeParse(process.env);

// 4. If validation fails (e.g. key is missing), print errors to log and abort startup
if (!parsedEnv.success) {
  console.error('\n❌ CRITICAL ERROR: Invalid Environment Configuration!\n');
  
  // Format the Zod issues to look readable in the console output
  const formattedErrors = parsedEnv.error.format();
  
  // Output JSON formatted list of schema violations
  console.error(JSON.stringify(formattedErrors, null, 2));
  console.error('\nServer starting aborted due to missing or invalid .env keys.\n');
  
  // Kill the process immediately. exit(1) lets container orchestrators know the boot failed
  process.exit(1); 
}

// 5. Export the fully typed and validated environment object to the rest of the application
export const env = parsedEnv.data;
```

---

## 🛡️ 2. Day 09 & Day 10: Authentication Middlewares

### File: [src/middlewares/auth.middleware.ts](file:///d:/anti/month-2-Multi-Merchant-SaaS/src/middlewares/auth.middleware.ts)
```typescript
import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma.config';
import { verifyToken } from '../utils/jwt';
import { env } from '../config/env';

// Extend default Express Request object to hold authenticated user details
export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}

/**
 * Middleware to protect routes from unauthorized access.
 * Extracts, decodes, and validates the bearer JWT.
 */
export async function protect(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    // 1. Retrieve the authorization header
    const authHeader = req.headers.authorization;
    
    // 2. Check if the header exists and uses the proper Bearer scheme
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ status: 'fail', message: 'Access Denied: Log in first.' });
    }

    // 3. Extract the raw token string
    const token = authHeader.split(' ')[1];
    
    // 4. Verify token signature and extract payload using the global secret key
    const decoded = verifyToken(token, env.JWT_SECRET);

    // 5. Check if user still exists in the database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, role: true } // Fetch only essential columns to save memory
    });

    // 6. If user was deleted or blocked in the database, reject the request
    if (!user) {
      return res.status(401).json({ status: 'fail', message: 'User session has expired.' });
    }

    // 7. Attach the database user object directly to the Express Request
    req.user = user;
    
    // 8. Hand over control to the next middleware or controller in the chain
    next();
  } catch (error) {
    // Return 401 if token validation failed (expired signature, modified payload, etc.)
    return res.status(401).json({ status: 'fail', message: 'Invalid or expired token.' });
  }
}

/**
 * Middleware factory to authorize platform-level global roles (e.g. ADMIN, SELLER, CUSTOMER).
 */
export function authorizePlatformRoles(...allowedRoles: string[]) {
  // Returns a closure that retains access to allowedRoles parameters
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // 1. Ensure protect middleware was executed first
    if (!req.user) {
      return res.status(401).json({ status: 'fail', message: 'Access Denied: Log in first.' });
    }

    // 2. Validate global role against whitelist
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ status: 'fail', message: 'Forbidden: Insufficient platform privileges.' });
    }

    // 3. Proceed to controller
    next();
  };
}

/**
 * Middleware factory to authorize tenant-level store roles (e.g. OWNER, STAFF).
 */
export function authorizeStoreRoles(...allowedStoreRoles: string[]) {
  // Returns an async middleware function
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ status: 'fail', message: 'Access Denied: Log in first.' });
    }

    // 1. Resolve Store ID from URL params, body payload, or query string
    const storeIdRaw = req.params.storeId || req.body.storeId || req.query.storeId;
    if (!storeIdRaw) {
      return res.status(400).json({ status: 'fail', message: 'Store ID is required for validation.' });
    }

    const storeId = Number(storeIdRaw);
    if (isNaN(storeId)) {
      return res.status(400).json({ status: 'fail', message: 'Invalid Store ID.' });
    }

    // 2. Platform Admins (ADMIN) bypass all tenant-level restrictions for support audits
    if (req.user.role === 'ADMIN') {
      return next();
    }

    // 3. Query the store membership database table using composite unique key for speed
    const membership = await prisma.storeMember.findUnique({
      where: {
        storeId_userId: {
          storeId,
          userId: req.user.id,
        },
      },
    });

    // 4. Block access if user is not a member of this store, or lacks the allowed role status
    if (!membership || !allowedStoreRoles.includes(membership.role)) {
      return res.status(403).json({ status: 'fail', message: 'Forbidden: Insufficient store privileges.' });
    }

    // 5. Authenticated & Authorized - proceed
    next();
  };
}
```

---

## 🔑 3. Day 09 & Day 10: Authentication Controller

### File: [src/controllers/auth.controller.ts](file:///d:/anti/month-2-Multi-Merchant-SaaS/src/controllers/auth.controller.ts)
```typescript
import { Request, Response } from "express";
import { prisma } from "../config/prisma.config";
import { comparePassword, hashPassword } from "../utils/password";
import { generateAccessToken, generateRefreshToken, verifyToken } from "../utils/jwt";
import { env } from "../config/env";

/**
 * Handles user sign-up and profile initialization.
 */
export async function register(req: Request, res: Response) {
  try {
    // 1. Extract payload variables
    const { email, password, firstName, lastName, role } = req.body;

    // 2. Validate input fields
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        status: "fail",
        message: "Email, password, first name, and last name are required.",
      });
    }

    // 3. Check if email is already registered in the system
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        status: "fail",
        message: "Email is already registered.",
      });
    }

    // 4. Hash user password to protect against cleartext database leaks
    const hashedPassword = await hashPassword(password);

    // 5. Atomically insert User and related Profile records
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: role || "CUSTOMER",
        profile: {
          create: {
            firstName,
            lastName,
            street: "",
            city: "",
            state: "",
            postalCode: "",
            country: "",
          },
        },
      },
      select: {
        id: true,
        email: true,
        role: true,
        profile: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // 6. Return standard created response
    return res.status(201).json({
      status: "success",
      user: newUser,
    });

  } catch (error: any) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}

/**
 * Handles user login, session generation, and refresh token cookie setup.
 */
export async function login(req: Request, res: Response) {
  try {
    // 1. Get user input
    const { email, password } = req.body;

    // 2. Validate payload
    if (!email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide email and password.",
      });
    }

    // 3. Fetch user record from database
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        status: "fail",
        message: "Incorrect email or password.",
      });
    }

    // 4. Verify password hash using bcrypt
    const isCorrect = await comparePassword(password, user.password);

    if (!isCorrect) {
      return res.status(401).json({
        status: "fail",
        message: "Incorrect email or password.",
      });
    }

    // 5. Generate short-lived access and long-lived refresh tokens
    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id);

    // 6. Persist refresh token in the database to enable lookup and rotation
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7-day expiration
      },
    });

    // 7. Store Refresh Token inside HttpOnly cookie for XSS protection
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // 8. Respond to the client with the access token
    return res.status(200).json({
      status: "success",
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error: any) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}

/**
 * Handles JWT Access Token regeneration using Refresh Token Rotation (RTR).
 */
export async function refresh(req: Request, res: Response) {
  try {
    // 1. Retrieve refresh token cookie
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({
        status: "fail",
        message: "Refresh token missing.",
      });
    }

    // 2. Decode and verify JWT signature validity
    const decoded: any = verifyToken(refreshToken, env.JWT_REFRESH_SECRET);

    // 3. Search token in database records
    const activeToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });

    // 4. REUSE DETECTION (COMPROMISE): Triggered if token signature is valid but missing in DB
    if (!activeToken) {
      // Attacker is attempting to reuse a rotated token. Wipe all sessions!
      await prisma.refreshToken.deleteMany({
        where: { userId: decoded.userId },
      });

      // Clear cookie immediately
      res.clearCookie("refreshToken");

      return res.status(403).json({
        status: "fail",
        message: "Refresh Token Reuse Detected. Security lockdown triggered.",
      });
    }

    // 5. Ensure the token holder exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return res.status(401).json({
        status: "fail",
        message: "User not found.",
      });
    }

    // 6. Generate a brand new token pair (Rotation)
    const newAccessToken = generateAccessToken(user.id, user.role);
    const newRefreshToken = generateRefreshToken(user.id);

    // 7. Atomically delete the old token and create the rotated token in the database
    await prisma.refreshToken.delete({
      where: { id: activeToken.id },
    });

    await prisma.refreshToken.create({
      data: {
        token: newRefreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    // 8. Update cookie value with new token
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // 9. Respond with the new access token
    return res.status(200).json({
      status: "success",
      accessToken: newAccessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error: any) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}

/**
 * Handles logouts by destroying the active refresh token session in database.
 */
export async function logout(req: Request, res: Response) {
  try {
    const { refreshToken } = req.cookies;

    // Delete token record from DB
    if (refreshToken) {
      await prisma.refreshToken.deleteMany({
        where: { token: refreshToken },
      });
    }

    // Clear response cookies
    res.clearCookie("refreshToken");

    return res.status(200).json({
      status: "success",
      message: "Logged out successfully.",
    });

  } catch (error: any) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}
```

---

## 🛒 4. Day 11: Store Management Controller

### File: [src/controllers/store.controller.ts](file:///d:/anti/month-2-Multi-Merchant-SaaS/src/controllers/store.controller.ts)
```typescript
import { Response } from 'express';
import { prisma } from '../config/prisma.config';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { z } from 'zod';

// Schema defining strict validation criteria for Store creations
export const createStoreSchema = z.object({
  name: z.string().min(2, 'Store name must be at least 2 characters.'),
  slug: z.string().min(2, 'Slug must be at least 2 characters.').regex(/^[a-z0-9-]+$/, 'Slug must only contain lowercase alphanumeric characters and dashes.'),
  description: z.string().optional(),
});

// Schema for store detail update edits
export const updateStoreSchema = z.object({
  name: z.string().min(2, 'Store name must be at least 2 characters.').optional(),
  description: z.string().optional(),
});

/**
 * Creates a Store and atomically registers the creator user as the OWNER.
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

    // 2. Validate URL slug uniqueness across the entire SaaS platform
    const existingStore = await prisma.store.findUnique({ where: { slug } });
    if (existingStore) {
      return res.status(400).json({ status: 'fail', message: 'Slug is already in use.' });
    }

    // 3. Atomically create Store and link the creator user as the OWNER
    const store = await prisma.store.create({
      data: {
        name,
        slug,
        description,
        ownerId: req.user.id,
        members: {
          create: {
            userId: req.user.id,
            role: 'OWNER', // Added as local OWNER
          },
        },
      },
      include: {
        members: true, // Return membership details in payload response
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
 * Edits metadata of a store (restricted to store owners).
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

    // 2. Perform DB update
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
 * Cascade deletes store records from the system.
 */
export async function deleteStore(req: AuthenticatedRequest, res: Response) {
  try {
    const storeId = Number(req.params.storeId);
    if (isNaN(storeId)) {
      return res.status(400).json({ status: 'fail', message: 'Invalid Store ID.' });
    }

    // Triggers cascading database deletes according to the cascade schema relationships
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
```

---

## 📦 5. Day 11: Product Catalog Controller

### File: [src/controllers/product.controller.ts](file:///d:/anti/month-2-Multi-Merchant-SaaS/src/controllers/product.controller.ts)
```typescript
import { Request, Response } from 'express';
import { prisma } from '../config/prisma.config';
import { z } from 'zod';
import { Prisma } from '@prisma/client';

// Schema defining validation criteria for new products
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
 * Adds a new Product to a specific Store.
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

    // 2. Validate category existance and ensure it is scoped to the target store
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category || category.storeId !== storeId) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid Category: The specified category does not exist under this store.',
      });
    }

    // 3. Check for slug uniqueness ONLY inside this specific store
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

    // 4. Create product with arbitrary-precision Decimal price format
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
 * Returns details of a product by ID (Public).
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
 * Edits details of a product (restricted to store owners/managers).
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

    // 3. Validate category scoping if category updates are requested
    if (categoryId !== undefined) {
      const category = await prisma.category.findUnique({ where: { id: categoryId } });
      if (!category || category.storeId !== storeId) {
        return res.status(400).json({ status: 'fail', message: 'Invalid Category for this store.' });
      }
    }

    // 4. Validate unique slug boundaries if slug changes
    if (slug && slug !== existingProduct.slug) {
      const slugTaken = await prisma.product.findUnique({
        where: { storeId_slug: { storeId, slug } },
      });
      if (slugTaken) {
        return res.status(400).json({ status: 'fail', message: 'Product slug is already in use.' });
      }
    }

    // 5. Perform update in database
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
 * Deletes a product from a store inventory catalog.
 */
export async function deleteProduct(req: Request, res: Response) {
  try {
    const storeId = Number(req.params.storeId);
    const productId = Number(req.params.id);

    if (isNaN(storeId) || isNaN(productId)) {
      return res.status(400).json({ status: 'fail', message: 'Invalid ID parameters.' });
    }

    // 1. Verify existence and store relation
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || product.storeId !== storeId) {
      return res.status(404).json({ status: 'fail', message: 'Product not found in this store.' });
    }

    // 2. Perform deletion
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
```
