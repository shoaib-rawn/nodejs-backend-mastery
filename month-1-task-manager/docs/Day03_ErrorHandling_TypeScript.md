# Day 3: Centralized Error Handling & TypeScript Imports

## 1. Centralized Error Handling in Express
Instead of scattering `try/catch` logic and `res.status(500).json(...)` calls throughout every route, Express provides a cleaner way. We can define a **Centralized Error Handling Middleware**.

### How it works
- It is a middleware function that takes **4 arguments**: `(err, req, res, next)`. Express recognizes that any middleware with exactly 4 parameters is an error handler.
- It is placed at the **very end** of the middleware and route chain (e.g. in `server.ts`), after all other `app.use()` and route definitions.
- Whenever an error occurs in any route, we can simply pass it to the `next` function like `next(error)`, and Express will skip all remaining normal routes and go straight to this error handler.

## 2. TypeScript `verbatimModuleSyntax` and Type Imports
When configuring TypeScript (in `tsconfig.json`), there is an option called `verbatimModuleSyntax`. 

### Why use it?
It forces you to be explicit about what you are importing. If you are importing something that is strictly a TypeScript **type** or **interface** (like `Request`, `Response`, or `NextFunction` from Express), you must import it using the `type` keyword.

```typescript
// Incorrect (when verbatimModuleSyntax is true):
import { Request, Response, NextFunction } from 'express';

// Correct:
import type { Request, Response, NextFunction } from 'express';
```

This makes the TypeScript compiler more efficient, as it knows it can completely remove the `import type` statement when compiling your code to plain JavaScript.
