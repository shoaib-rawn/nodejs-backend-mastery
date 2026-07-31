import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma.config';
import { verifyToken } from '../utils/jwt';
import { env } from '../config/env';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}

export async function protect(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ status: 'fail', message: 'Access Denied: Log in first.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token, env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, role: true }
    });

    if (!user) {
      return res.status(401).json({ status: 'fail', message: 'User session has expired.' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ status: 'fail', message: 'Invalid or expired token.' });
  }
}

/**
 * Middleware factory to authorize platform-level global roles (e.g. ADMIN, SELLER, CUSTOMER).
 */
export function authorizePlatformRoles(...allowedRoles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ status: 'fail', message: 'Access Denied: Log in first.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ status: 'fail', message: 'Forbidden: Insufficient platform privileges.' });
    }

    next();
  };
}

/**
 * Middleware factory to authorize tenant-level store roles (e.g. OWNER, ADMIN, STAFF).
 */
export function authorizeStoreRoles(...allowedStoreRoles: string[]) {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ status: 'fail', message: 'Access Denied: Log in first.' });
    }

    // 1. Resolve Store ID from request params, query, or body
    const storeIdRaw = req.params.storeId || req.body.storeId || req.query.storeId;
    if (!storeIdRaw) {
      return res.status(400).json({ status: 'fail', message: 'Store ID is required for validation.' });
    }

    const storeId = Number(storeIdRaw);
    if (isNaN(storeId)) {
      return res.status(400).json({ status: 'fail', message: 'Invalid Store ID.' });
    }

    // 2. Platform Admins (ADMIN) bypass all tenant-level constraints
    if (req.user.role === 'ADMIN') {
      return next();
    }

    // 3. Query the store membership database table
    const membership = await prisma.storeMember.findUnique({
      where: {
        storeId_userId: {
          storeId,
          userId: req.user.id,
        },
      },
    });

    // 4. Block access if user is not a member or doesn't have permissions
    if (!membership || !allowedStoreRoles.includes(membership.role)) {
      return res.status(403).json({ status: 'fail', message: 'Forbidden: Insufficient store privileges.' });
    }

    next();
  };
}
