import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12; // Production secure standard balance between CPU workload and security

/**
 * Takes a plain text password and returns its secure bcrypt hash.
 * @param password Plain text password
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compares a plain text password with a hashed password.
 * Returns true if it matches, false otherwise.
 * @param password Plain text password
 * @param hash BCRYPT hashed password from database
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
