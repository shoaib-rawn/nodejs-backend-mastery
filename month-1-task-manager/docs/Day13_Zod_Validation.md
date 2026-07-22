# Day 13: Input Validation with Zod

## The Problem with Manual Validation
In our `task.controller.ts`, we previously validated the input like this:

```typescript
const { title } = req.body;
if (!title) {
    return res.status(400).json({ success: false, message: "Title is required" });
}
```

This works fine for one field. But what if we are creating a User profile with a `name`, `email` (must be valid format), `password` (min 8 characters), and `age` (must be a number > 18)? 
Writing `if` statements for every single condition becomes impossible to maintain.

Furthermore, hackers can send unexpected data (like passing an array instead of a string) to crash your server or hack your database (NoSQL Injection). **Never trust data coming from the client.**

---

## Enter Zod (Schema Validation)
[Zod](https://zod.dev/) is a modern, TypeScript-first validation library. Instead of writing `if` statements, you define a **Schema** (a blueprint). If the incoming data doesn't perfectly match the blueprint, Zod throws a detailed error automatically.

### 1. Defining a Schema
Here is how we define what a "Task" creation request should look like:

```typescript
import { z } from 'zod';

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: "Title is strictly required",
      invalid_type_error: "Title must be a text string"
    }).min(3, "Title must be at least 3 characters long")
  })
});
```

### 2. Creating a Generic Validation Middleware
Instead of parsing the Zod schema inside every controller, we use the power of Express Middleware. We create a generic `validate(schema)` middleware.

We inject this middleware directly into our route:
```typescript
// If validation fails, the middleware blocks the request and sends a 400 error.
// If it succeeds, it calls next() and the controller runs safely.
router.post('/', validate(createTaskSchema), createTask);
```

### Benefits of Zod:
1. **Security:** Blocks malicious payloads instantly.
2. **Clean Controllers:** Your controller no longer needs dozens of `if` statements. It assumes the data is 100% correct by the time it executes.
3. **TypeScript Integration:** Zod can automatically infer TypeScript types from your schemas, so you don't have to define `interface Task` manually!
