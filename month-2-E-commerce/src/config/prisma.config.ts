import { PrismaClient } from '@prisma/client';

/**
 * Shared singleton instance of the PrismaClient.
 * Reusing this single instance across the application ensures we do not open
 * excessive connection pools to PostgreSQL.
 */
export const prisma = new PrismaClient({
  // Enable query logging in development mode for easy debugging
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error']
});
