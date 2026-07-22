# Day 9: Environment Variables (`.env`)

## The Problem
When building APIs, you will eventually have sensitive information that should NEVER be pushed to GitHub:
- Database connection strings
- API Keys (like Stripe, AWS, or OpenAI)
- JWT Secrets for authentication

You also have variables that change depending on where the app is running:
- Port number (e.g., 5000 on your computer, but 80 or 443 in production)
- Node Environment (e.g., `development` vs `production`)

Hardcoding these into your `server.ts` is a major security risk and bad practice.

## The Solution: Environment Variables

Environment variables are key-value pairs stored outside of your application code, usually provided by the operating system or hosting provider (like Heroku or AWS). 

To manage these easily during local development, we use a file called `.env` (pronounced "dot-env") and a package named `dotenv`.

### How it works:

1. **Create a `.env` file in the root of your project:**
   ```env
   PORT=5000
   NODE_ENV=development
   DATABASE_URL=mongodb+srv://user:password@cluster.mongodb.net
   ```

2. **Add `.env` to `.gitignore`:**
   **CRITICAL:** You must tell Git to ignore the `.env` file so it is never pushed to GitHub!

3. **Access them in Node.js:**
   Node provides a global object called `process.env`. Once you load the `dotenv` package, it automatically reads your `.env` file and attaches the values to `process.env`.
   
   ```typescript
   import 'dotenv/config'; // Automatically loads the .env file

   const port = process.env.PORT; // "5000"
   const isProd = process.env.NODE_ENV === 'production'; // false
   ```

---

## Best Practice: Centralized Config File

While you can write `process.env.PORT` everywhere in your app, it's safer to read all environment variables in one single `config` file. This allows you to set defaults and throw errors if an important variable is missing, keeping your app from crashing mysteriously later on.

```typescript
// src/config/env.config.ts
import 'dotenv/config';

export const config = {
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',
    dbUrl: process.env.DATABASE_URL
};
```
