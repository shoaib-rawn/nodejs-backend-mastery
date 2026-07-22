# Day 5: Architecture Setup (Controllers & Routes)

## Why split the code?
Right now, your `server.ts` file contains everything: server configuration, middleware, and the logic for every single route. As your application grows, `server.ts` will become thousands of lines long and impossible to read. 

To fix this, we use the **Separation of Concerns** principle. We split our code into specific folders based on what the code does.

## The Standard Express Structure
We usually divide our API into two main parts:
1. **Routes (`src/routes/`)**: This is like a traffic cop. It receives an incoming HTTP request (like a GET or POST) and decides *where* to send it. It does **not** process the data.
2. **Controllers (`src/controllers/`)**: This is the brain. The route sends the request here. The controller does the actual work (checking the database, formatting data, throwing errors) and sends the response back to the user.

## How `express.Router()` works
Express provides a tool called `Router` to help us split our routes into different files.

### 1. The Controller (`task.controller.ts`)
Instead of writing the function directly in `server.ts`, we export it from a controller file:
```typescript
import type { Request, Response } from 'express';

export const getTasks = (req: Request, res: Response) => {
    res.json({ message: "Here are all the tasks!" });
};
```

### 2. The Route (`task.routes.ts`)
We create a router, import the controller, and connect them:
```typescript
import { Router } from 'express';
import { getTasks } from '../controllers/task.controller.js';

const router = Router();

// When someone goes to GET /, it calls the getTasks controller
router.get('/', getTasks);

export default router;
```

### 3. The Server (`server.ts`)
Finally, we import our cleanly packaged router into the main server file and tell Express to use it:
```typescript
import taskRoutes from './src/routes/task.routes.js';

// All requests starting with '/api/tasks' will be sent to the taskRoutes file!
app.use('/api/tasks', taskRoutes);
```

By doing this, `server.ts` stays clean and only handles the main setup!
