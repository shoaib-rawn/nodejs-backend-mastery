# Day 15: Homework & Activities

Today's goal is to add dynamic sorting to our `getTasks` controller.

## Task 1: Update the Mock DB
Our current `tasks.json` mock database doesn't have a `createdAt` date. 
1. Open `src/data/tasks.json` and add a fake `createdAt` string to a few tasks so we can test sorting by date.
   * *Example:* `"createdAt": "2026-07-10T10:00:00.000Z"`

## Task 2: Add Sorting Logic to the Controller
1. Open `src/controllers/task.controller.ts`.
2. Go to your `getTasks` function.
3. Extract `sortBy` and `order` from `req.query`. (Default `sortBy` to `"createdAt"` and `order` to `"desc"` so the newest tasks are always shown first).
   * *Hint:* `const sortBy = req.query.sortBy as string || "createdAt";`
4. Add the `.sort()` logic **AFTER** the filtering step, but **BEFORE** the pagination (slicing) step.
5. Write an `if` statement: if `order === 'desc'`, sort it backwards, otherwise sort it forwards (`asc`).

## Task 3: Test in Postman
1. Open Postman and make a `GET` request to: `http://localhost:5000/api/tasks?sortBy=title&order=asc`
2. Verify that your tasks are returned in perfect alphabetical order by title!
3. Try `http://localhost:5000/api/tasks?sortBy=createdAt&order=desc` to see the newest tasks first.
