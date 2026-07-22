# Day 14: Homework & Activities

Today's goal is to implement pagination in our `getTasks` controller so we can control how much data we send back to the client.

## Task 1: Add Pagination to the Controller
1. Open `src/controllers/task.controller.ts`.
2. Go to your `getTasks` function.
3. Extract `page` and `limit` from `req.query`. (Remember to provide defaults and convert them to numbers, because query params are always strings!).
   * *Hint:* `const page = parseInt(req.query.page as string) || 1;`
4. Calculate the `startIndex` and `endIndex` using the math from today's theory notes.
5. Use the JavaScript `.slice()` method to grab only the requested portion of the `tasks` array.
6. Return the sliced array in your `res.json()`, along with some helpful metadata (like `currentPage` and `totalTasks`).

## Task 2: Test in Postman
1. Generate some fake tasks in your mock DB array so you have more than 5 tasks.
2. Open Postman and make a `GET` request to: `http://localhost:5000/api/tasks?page=1&limit=2`
3. Verify that you only receive 2 tasks!
4. Change the URL to `?page=2&limit=2` and verify you receive the *next* 2 tasks.
