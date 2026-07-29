import { z } from 'zod';
import dotenv from 'dotenv';

// 1. Load variables from the local .env file
dotenv.config();

// 2. Define the exact shape and types of your environment variables
const envSchema = z.object({
  PORT: z.coerce.number().default(5000), // Coerces string "5000" to number 5000
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().url(), // Enforces a valid URL format (e.g. postgresql://...)
  JWT_SECRET: z.string().min(8), // Validates security key has minimum length of 8
  JWT_REFRESH_SECRET: z.string().min(8),
});

// 3. Perform the parsing safely
const parsedEnv = envSchema.safeParse(process.env);

// 4. If validation fails, dump the errors and kill the server immediately
if (!parsedEnv.success) {
  console.error('\n❌ CRITICAL ERROR: Invalid Environment Configuration!\n');
  
  // Format the Zod issues to look readable in the console
  const formattedErrors = parsedEnv.error.format();
  
  console.error(JSON.stringify(formattedErrors, null, 2));
  console.error('\nServer starting aborted due to missing or invalid .env keys.\n');
  
  process.exit(1); // Exits the process with error code 1 (failure)
}

// 5. Export the fully typed and validated environment object
export const env = parsedEnv.data;
