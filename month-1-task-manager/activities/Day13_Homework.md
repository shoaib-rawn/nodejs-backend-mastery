# Day 13 Homework: Implement Update Task Validation

## The Challenge
Now that we have successfully added Zod validation for creating a task (`createTaskSchema`), it's your turn to secure the Update Route (`PUT /api/tasks/:id`).

### Instructions:
1. Open `src/validators/task.validator.ts`.
2. Create a new exported variable named `updateTaskSchema`.
3. The schema should expect a `body` object.
4. Inside the body, both `title` and `completed` fields should be **optional**, meaning the user can send just the title, just the completed status, or both!
   - *Hint:* Use `.optional()` in Zod.
   - If `title` is provided, it must be a string with a minimum of 3 characters.
   - If `completed` is provided, it must strictly be a boolean.
5. Once your schema is ready, open `src/routes/task.routes.ts`.
6. Import `updateTaskSchema`.
7. Inject the `validate(updateTaskSchema)` middleware into the `router.put('/:id')` route, exactly like we did for the POST route.

### Testing
Use Postman to send a `PUT` request to update an existing task.
1. Try sending a number in the `completed` field (e.g. `1` instead of `true`). Zod should block it.
2. Try sending a `title` with only 1 character ("A"). Zod should block it.
3. Try sending valid data. It should succeed!
