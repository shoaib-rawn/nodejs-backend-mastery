# Day 7: Third-Party Middleware (Morgan for Logging)

Welcome to Day 7! Today, we are learning about **Third-Party Middleware** by integrating **Morgan**, the standard HTTP request logger middleware for Node.js.

## Why Third-Party Middleware?
In Day 6, we built a custom request logger middleware. While custom middleware is great for learning and highly specific tasks, in the industry we avoid rewriting common functionalities. 
Using well-tested, popular third-party middlewares from the npm ecosystem has multiple advantages:
1. **Reliability:** Built and tested by thousands of developers.
2. **Speed & Efficiency:** Optimizes things like asynchronous event hookups (like waiting for the `finish` event to log the correct status code).
3. **Standards:** Follows industry-standard formats (like Apache log styling).

## What is Morgan?
`morgan` is a middleware that automatically logs details about HTTP requests made to your server. It prints information such as:
* HTTP Method (GET, POST, etc.)
* Request URL
* Response Status Code
* Response Time (in milliseconds)
* Content Length of the response

## Morgan Log Formats
Morgan comes with several built-in log formats:
1. **`dev` (Most Common for Development):** Colored by status code for developer readability.
   * Example: `GET /api/tasks 200 4.120 ms - 150`
2. **`combined` (Standard Apache combined log format):** Very detailed, used for production.
   * Example: `:remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"`
3. **`tiny`:** A minimal log format.
   * Example: `GET /api/tasks 200 150 - 4.120 ms`

## Installation
Because we are using TypeScript, we must install both `morgan` (the library) and its TypeScript definitions (`@types/morgan`) as a dev dependency:
```bash
npm install morgan
npm install -D @types/morgan
```

## Integration
In your Express server:
```typescript
import morgan from 'morgan';

// Mount it globally
app.use(morgan('dev'));
```

When placed at the top of your server, Morgan will automatically hook into the request-response lifecycle and log output to the console once the response is fully completed.
