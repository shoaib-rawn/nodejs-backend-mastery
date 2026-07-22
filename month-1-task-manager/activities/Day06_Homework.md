# Day 6 Homework: Build a Request Logger!

Now that you know how Middleware works, you are going to build your own custom middleware.

## The Task
Whenever someone makes a request to your API, you want to log it to the console so you know what's happening. You will create a **Logger Middleware** that prints out the HTTP Method (GET, POST, etc.) and the URL the user visited.

### Instructions:

1. **Create the Middleware File:**
   - In your `src` folder, create a new folder called `middlewares`.
   - Inside that folder, create a file called `logger.middleware.ts`.

2. **Write the Middleware Logic:**
   - Inside `logger.middleware.ts`, write and export a middleware function called `requestLogger`.
   - The function should take `req`, `res`, and `next` as parameters (make sure to import their types from `express`!).
   - Inside the function, use `console.log` to print a message like this: 
     `[LOG] GET request made to /api/tasks` 
     *(Hint: You can use `req.method` to get "GET" and `req.url` to get "/api/tasks")*
   - Don't forget to call `next()` at the end so the request doesn't get stuck!

3. **Plug it into your Server:**
   - Go to your `server.ts` file.
   - Import your new `requestLogger`.
   - Add it as a global middleware using `app.use(requestLogger);`. 
   - **Important:** Make sure you put this line *before* your routes (`app.use('/api/tasks', taskRoutes);`) so the logger runs first!

---

## Expected Result
When you run `npm run dev` and refresh your browser at `http://localhost:5000/` or `http://localhost:5000/api/tasks`, you should see your custom logs appearing in your VSCode terminal!

Once you have this working, reply here and we will move on to Day 7!
