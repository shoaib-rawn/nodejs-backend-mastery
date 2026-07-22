# Day 8 Homework: Implementing Dynamic Routes

## The Challenge

Now that we understand `req.params` and `req.query`, let's make our Task Manager API actually useful! Currently, our `getAllTasks` controller just returns the whole array. We want to add the ability to fetch a specific task by its ID, and filter our task list by completion status.

---

## Instructions

### 1. Update the Controller (`src/controllers/task.controller.ts`)

**Part A: Fetching a single task (Params)**
1. Create and export a new controller function named `getTaskById`.
2. Inside `getTaskById`, extract the `id` from `req.params`.
3. Use the JavaScript `.find()` array method to search the mock `tasks` array for a task whose `id` matches the one from the URL.
4. If a task is found, return a `200 OK` status with the task object.
5. If no task is found, return a `404 Not Found` status with a JSON message: `{ message: "Task not found" }`.

**Part B: Filtering tasks (Queries)**
1. Modify your existing `getAllTasks` controller function.
2. Check if the client provided a `completed` query parameter (`req.query.completed`).
3. If `req.query.completed` is exactly the string `"true"`, use `.filter()` to return only completed tasks.
4. If `req.query.completed` is exactly the string `"false"`, return only incomplete tasks.
5. If no query is provided (or if it's something else), just return the entire array as it did before.

### 2. Update the Routes (`src/routes/task.routes.ts`)

1. Import your new `getTaskById` controller at the top of the file.
2. Create a new `GET` route for `/:id` and attach the `getTaskById` controller to it.
   *(Important: Ensure you put this new route below any static GET routes if you have them, so Express doesn't get confused!)*

---

## 🧪 Expected Results to Test

Make sure your Express server is running (`npm run dev`), then test these in your browser or Postman/ThunderClient:

1. **Test Params:**
   - Go to `http://localhost:5000/api/tasks/1` 
   - *Result:* You should receive just the task with ID "1".
   - Go to `http://localhost:5000/api/tasks/99` 
   - *Result:* You should receive your custom 404 "Task not found" error.

2. **Test Queries:**
   - Go to `http://localhost:5000/api/tasks?completed=true`
   - *Result:* You should only see the tasks where `completed` is `true`.

Once you've implemented and tested the code, let me know, and we can merge the `feature/routing-args` branch!
