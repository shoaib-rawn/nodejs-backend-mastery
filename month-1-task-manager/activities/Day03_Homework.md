# Day 3 Homework: Triggering the Error Handler

## The Goal
Prove that your centralized error handler is working correctly by intentionally triggering an error in one of your routes.

## Instructions
1. Open one of your route/controller files (e.g., your task routes).
2. Inside one of your route handlers (like a `GET` or `POST` route), add code to deliberately trigger an error. 
   - Example: `next(new Error("Simulated database failure!"));`
3. Start your development server.
4. Use **Postman** (or your browser for a GET request) to hit that specific route.

## Expected Result
Instead of crashing your server or sending back a messy HTML stack trace, your API should respond with a clean JSON object and a `500 Internal Server Error` status code, looking something like this:

```json
{
  "error": "Simulated database failure!"
}
```

Once you confirm this works, you can remove the intentional error from your code. Congratulations on setting up professional error handling!
