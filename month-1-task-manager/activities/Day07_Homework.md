# Day 7 Homework: Integrating Morgan and Customizing Logs

Now that you understand third-party middleware and Morgan, it is time to implement it in your project.

## The Task
Replace our custom logger middleware with **Morgan**, but customize it so that we can log different formats based on whether we are in development or production.

### Instructions:

1. **Install Dependencies:**
   - Install `morgan` as a production dependency.
   - Install `@types/morgan` as a development dependency (`-D`).

2. **Clean Up Custom Middleware:**
   - Since we are using Morgan, we no longer need to mount our custom `requestLogger` in `server.ts`. Remove `app.use(requestLogger);` and its import from `server.ts`. 
   *Note: Keep the `logger.middleware.ts` file in your folder as a historical reference, but we will no longer use it.*

3. **Integrate Morgan:**
   - Import `morgan` in `server.ts`.
   - Mount it globally using:
     ```typescript
     app.use(morgan('dev'));
     ```
   - Verify that when you hit `/api/tasks`, a colored log automatically appears in the console showing the HTTP Method, path, status code, and response time.

4. **[Bonus/Standard Practice] Custom Log Formatting:**
   - Instead of just `'dev'`, configure Morgan to use the `'combined'` format if a certain condition is met (we will use this later when we set up environment variables!). For now, just test both `'dev'` and `'tiny'` configurations to see how they look different.

---

## Expected Result
When you run `npm run dev` and request `/api/tasks`, you should see professional logs like this:
```bash
GET /api/tasks 200 4.125 ms - 150
```

Once you have completed this, let me know, and we'll append the interview notes and merge the feature branch!
