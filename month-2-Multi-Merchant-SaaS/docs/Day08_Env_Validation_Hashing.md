# Day 08: Strict Environment Validation & Password Hashing

Today, we are learning about two critical security concepts: **Environment Variable Validation using Zod** and **Cryptographic Password Hashing with Bcrypt**.

---

## 1. Environment Variable Validation with Zod

Environment variables (`.env`) configure database connections, port numbers, security secrets, and environment profiles (like development vs. production). 

### Why validate environment variables?
Normally, Node.js accesses environment variables dynamically via `process.env.VARIABLE_NAME`. If a developer forgets to configure a key (like `DATABASE_URL` or `JWT_SECRET`), the server starts up fine but crashes later when a user attempts to run a query or log in. 
This is a **silent failure** that can cause downtime in production.

To prevent this, we validate our environment variables **at startup** using a schema validation tool like **Zod**. If a variable is missing or invalid, the server will crash immediately with a clear error output, alerting the developer before any broken code is deployed.

### Basic Zod Validation Example:
```typescript
import { z } from 'zod';
import dotenv from 'dotenv';
dotenv.config();

// Define validation rules
const schema = z.object({
  PORT: z.coerce.number().default(5000), // convert string "5000" to number 5000
  DATABASE_URL: z.string().url()         // enforces a valid database connection URL
});

const result = schema.safeParse(process.env);
if (!result.success) {
  console.error("❌ Environment validation error:", result.error.format());
  process.exit(1); // Stop server startup immediately
}

export const env = result.data;
```

---

## 2. Secure Password Hashing with Bcrypt

In modern database security, **passwords must never be stored as plain text**. If a hacker accesses the database, they will instantly compromise all customer logins.

Instead, we store a **cryptographic hash** of the password. A hash function is a one-way mathematical algorithm:
*   Given `password123`, it produces `$2a$12$N9qo8DgBvv...`.
*   Given `$2a$12$N9qo8DgBvv...`, it is computationally impossible to reverse it to recover `password123`.

### Salting
To prevent hackers from using pre-computed lists of common password hashes (called **Rainbow Tables**), we add a random string of characters (called a **Salt**) to the password before hashing it. 
Bcrypt handles salting automatically. You specify the number of **Salt Rounds** (work factor). We use `12` rounds, which is the current industry balance between CPU workload and brute-force resistance.

### Hashing and Comparing Passwords:
```typescript
import bcrypt from 'bcryptjs';

// Hashing a password
const hash = await bcrypt.hash('plainpassword123', 12);

// Comparing a login request
const isMatch = await bcrypt.compare('plainpassword123', hash); // returns true
```
