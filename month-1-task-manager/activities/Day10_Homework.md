# Day 10 Homework: Implement Task CRUD Operations

## The Challenge
Now that we understand `req.body` and HTTP methods, your job is to finish the core logic of our Task Manager!

### Instructions:

1. **Update the Controller (`src/controllers/task.controller.ts`):**
   Implement and export three new functions:
   - `createTask`: Reads `title` from `req.body`, generates an ID, adds it to the `tasks` array, and returns `201`.
   - `updateTask`: Reads `id` from `req.params`, updates `title` and/or `completed` from `req.body`, and returns the updated task. Return `404` if not found.
   - `deleteTask`: Reads `id` from `req.params`, removes the task from the array, and returns a success message. Return `404` if not found.

2. **Update the Routes (`src/routes/task.routes.ts`):**
   Import your new controller functions and map them to the proper REST routes:
   - `router.post('/', createTask)`
   - `router.put('/:id', updateTask)`
   - `router.delete('/:id', deleteTask)`

### Testing (Using Postman)
Since you cannot send `POST`, `PUT`, or `DELETE` requests directly from a web browser address bar, you MUST use Postman to test these!
- Set the method to `POST`.
- Go to the **Body** tab.
- Select **raw** and change the format from `Text` to `JSON`.
- Example Body for POST:
  ```json
  {
      "title": "Buy groceries"
  }
  ```
