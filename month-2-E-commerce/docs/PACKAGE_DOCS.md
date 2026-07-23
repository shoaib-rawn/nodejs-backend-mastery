# 📦 `package.json` Line-by-Line Documentation

> ⚠️ **Note:** Standard JSON files (`package.json`) do not support `//` inline comments (adding `//` causes a JSON syntax error). This file serves as your permanent guide to understanding every field and dependency in your `package.json`.

---

## ⚙️ Core Configuration

```json
{
  "name": "ecommerce-api",
  "version": "1.0.0",
  "description": "Month 2 Project: E-Commerce REST API with PostgreSQL, Prisma ORM, and Web Security",
  "main": "dist/server.js"
}
```
- **`name`**: The identifier of your project.
- **`version`**: Semantic versioning (`MAJOR.MINOR.PATCH`).
- **`main`**: The compiled entry point used when starting production (`dist/server.js`).

---

## 🚀 NPM Scripts

```json
"scripts": {
  "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
  "build": "tsc",
  "start": "node dist/server.js"
}
```
- **`npm run dev`**: Starts `ts-node-dev` which watches `.ts` files, auto-restarts on save, and formats colored terminal logs.
- **`npm run build`**: Runs `tsc` to compile TypeScript in `src/` to JavaScript in `dist/`.
- **`npm run start`**: Runs the compiled production code with `node`.

---

## 📦 Production Dependencies (`dependencies`)

```json
"dependencies": {
  "@prisma/client": "^5.22.0",  // Auto-generated type-safe database client for PostgreSQL
  "cors": "^2.8.5",              // Middleware enabling Cross-Origin requests from frontend apps
  "dotenv": "^16.4.7",          // Loads environment variables from .env into process.env
  "express": "^4.21.2",          // Core REST API web framework
  "helmet": "^8.0.0",             // Security middleware setting HTTP protection headers
  "pg": "^8.13.1"                // PostgreSQL client driver for live SQL database connections
}
```

---

## 🛠️ Development Dependencies (`devDependencies`)

```json
"devDependencies": {
  "@types/cors": "^2.8.17",       // TypeScript type definitions for cors
  "@types/express": "^4.17.21",   // TypeScript type definitions for express (req, res)
  "@types/node": "^22.10.1",      // TypeScript type definitions for Node.js (process, path)
  "@types/pg": "^8.11.10",       // TypeScript type definitions for PostgreSQL driver
  "prisma": "^5.22.0",            // Prisma CLI tool for DB migrations & schema management
  "ts-node-dev": "^2.0.0",        // Dev server with auto-reload & colored terminal logs
  "typescript": "^5.7.2"          // TypeScript compiler (tsc)
}
```
