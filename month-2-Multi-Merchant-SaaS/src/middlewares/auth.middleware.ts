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
