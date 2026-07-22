# Day 17: Homework & Activities

Today's goal is to protect your Task Manager API from DDOS attacks using the `express-rate-limit` package!

## Task 1: Setup and Installation
1. Open your terminal and install the rate limiting package:
   ```bash
   npm install express-rate-limit
   ```

## Task 2: Configure the Rate Limiter Middleware
1. Open your `server.ts` file.
2. Import the `rateLimit` function from `express-rate-limit`.
3. Create a rate limiter configuration object. It should look like this:
```typescript
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes in milliseconds
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    message: {
        success: false,
        message: "Too many requests from this IP, please try again after 15 minutes"
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
```

## Task 3: Attach the Limiter to the Server
1. Apply the middleware globally by adding `app.use(limiter)` into your `server.ts` file.
2. **Important:** Place this high up in your middleware stack (e.g., right after `express.json()`), so it blocks bad requests *before* they reach your routes or database!

## Task 4: Test it!
1. To test if it works without waiting 15 minutes, temporarily change `max: 100` to `max: 3`.
2. Open Postman and make 4 quick GET requests to `/api/tasks`.
3. On the 4th request, the server should block you and return a `429 Too Many Requests` status code with your custom JSON message!
