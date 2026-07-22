# Day 5 Homework: Setting up the Task Routes

## The Goal
Clean up your `server.ts` file by moving the Task logic into a separate `task.controller.ts` file and a `task.routes.ts` file.

## Instructions

### Step 1: Set up the Folders
1. Inside your `src` folder, create a new folder named `routes`.
2. Ensure you have the `controllers` folder from earlier. (You should already have `src/controllers/task.controller.ts`).

### Step 2: The Controller
Open `src/controllers/task.controller.ts`. Ensure it looks something like this (you can remove any old broken code):
```typescript
import type { Request, Response } from 'express';

export const getAllTasks = (req: Request, res: Response) => {
    res.status(200).json({
        message: "This will be the Task Manager API!",
        tasks: []
    });
};
```

### Step 3: The Route
1. Inside `src/routes`, create a new file named `task.routes.ts`.
2. Import `Router` from express, and import `getAllTasks` from your controller.
3. Set up a `GET /` route that triggers `getAllTasks`.
4. Export the router.

### Step 4: Clean up server.ts
1. Open `server.ts`.
2. **Delete** the old starter route: 
   `app.get('/api/tasks', (req: Request, res: Response) => { ... })`
3. Import your new routes at the top:
   `import taskRoutes from './src/routes/task.routes.js';` *(Don't forget the .js extension!)*
4. Link the routes right above your error handler:
   `app.use('/api/tasks', taskRoutes);`

## Expected Result
Start your server with `npm run dev`.
Go to `http://localhost:5000/api/tasks` in your browser. It should work exactly exactly as it did before, but now your code is professionally organized! 

Once it works, check off Day 5 in your `TASKS.md`!
