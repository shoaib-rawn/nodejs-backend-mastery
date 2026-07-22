# Day 6: Understanding Middleware in Express

Welcome to Day 6! Today we are diving into one of the most powerful concepts in Express.js: **Middleware**.

## What is Middleware?
Imagine a car wash. 
1. The dirty car enters (the **Request**).
2. It goes through the soap station, then the scrub station, then the rinse station (the **Middlewares**).
3. Finally, the clean car exits (the **Response**).

In Express, a middleware is simply a function that has access to the Request object (`req`), the Response object (`res`), and a special function called `next`.

Middleware can:
- Execute any code.
- Make changes to the request and the response objects (like adding user info).
- End the request-response cycle.
- Call the next middleware function in the stack using `next()`.

## The Anatomy of a Middleware Function
```typescript
import type { Request, Response, NextFunction } from 'express';

const myMiddleware = (req: Request, res: Response, next: NextFunction) => {
    console.log("I am a middleware! I run before the route handler.");
    
    // You MUST call next() to pass control to the next function, 
    // otherwise the request will hang forever!
    next(); 
};
```

## How to use it?
You can use middleware globally (for every route) or locally (for a specific route).

### 1. Global Middleware
We are already using global middleware in our `server.ts`!
```typescript
// This runs on EVERY single request to parse JSON data
app.use(express.json());
```

### 2. Route-Specific Middleware
You can add middleware to a specific route by placing it before the final controller function.
```typescript
import { Router, Request, Response, NextFunction } from 'express';

const router = Router();

// A simple middleware that checks if a user is "logged in"
const checkAuth = (req: Request, res: Response, next: NextFunction) => {
    const isLoggedIn = true; // Pretend we checked a database
    
    if (isLoggedIn) {
        next(); // User is good, proceed to the actual route
    } else {
        res.status(401).json({ message: "Unauthorized!" }); // Stop the request here
    }
};

// We put `checkAuth` in the middle!
router.get('/protected', checkAuth, (req, res) => {
    res.json({ message: "Welcome to the secret area!" });
});
```

## Why is it useful?
Middleware keeps your code DRY (Don't Repeat Yourself). Instead of checking if a user is authenticated in every single controller, you write one `checkAuth` middleware and just plug it into the routes that need it!

---
Head over to `activities/Day06_Homework.md` for your task!
