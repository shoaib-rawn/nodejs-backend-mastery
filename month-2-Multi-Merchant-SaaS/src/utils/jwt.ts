import jwt from 'jsonwebtoken';
import { env } from '../config/env';

/**
 * Generates a short-lived access token for authenticating API requests.
 * Lifespan: 15 minutes
 * @param userId User's database ID
 * @param role User's platform role (ADMIN, SELLER, CUSTOMER)
 */
export function generateAccessToken(userId: number, role: string): string {
  return jwt.sign(
    { userId, role },
    env.JWT_SECRET,
    { expiresIn: '15m' }
  );
}

/**
 * Generates a long-lived refresh token for rotating access tokens.
 * Lifespan: 7 days
 * @param userId User's database ID
 */
export function generateRefreshToken(userId: number): string {
  const nonce = Math.random().toString(36).substring(2, 15);
  return jwt.sign(
    { userId, nonce },
    env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
}

/**
 * Verifies a token's signature and expiration.
 * Returns the decoded token payload or throws an error.
 * @param token The JWT string
 * @param secret The signing key (JWT_SECRET or JWT_REFRESH_SECRET)
 */
export function verifyToken(token: string, secret: string): any {
  return jwt.verify(token, secret);
}
