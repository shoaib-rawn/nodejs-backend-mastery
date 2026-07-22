# Backend Interview Preparation Notes

This file contains key interview questions and answers accumulated daily to prepare you for senior backend developer interviews.

---

## 📅 Day 6: HTTP, Express Architecture, Middleware, and Git Flow

Here are 10 critical interview questions covering what we have built and discussed so far (Days 1 to 6).

### Q1: What is the difference between a Route Handler and Middleware in Express?
* **Answer:** 
  In Express, both are technically middleware functions. However:
  * **Middleware** is designed to intercept the request-response cycle. It performs operations (like logging, authentication, parsing JSON) and either passes control to the next function using `next()`, or terminates the request early.
  * **Route Handler** (or Controller) is the *final destination* of a request. It contains the business logic to generate the response and terminates the cycle (e.g., using `res.json()` or `res.send()`). It rarely calls `next()`, unless it catches an error to forward to the centralized error handler.

### Q2: What is the difference between `req.url` and `req.originalUrl` in Express?
* **Answer:**
  * `req.url` returns the path relative to the router it is currently executing inside. If a router is mounted at `/api/tasks` and the user hits `/api/tasks/list`, inside the router `req.url` will be stripped down to `/list`.
  * `req.originalUrl` preserves the original request URL exactly as typed by the client (`/api/tasks/list`), regardless of how many nested routers it goes through. This is why we use `req.originalUrl` for global logging.

### Q3: Why does Node.js Express log a default `200` status code inside global request loggers unless we wait for the `finish` event?
* **Answer:**
  Express executes middleware in order. If a logger is placed at the top of the middleware stack, it runs *before* the route controller can process the request or change the status code (e.g., to a `404` or `500`). At the start of the request, Express assigns a default status code of `200` to the response object.
  To log the correct final status code, we must listen to the response's `finish` event:
  ```typescript
  res.on('finish', () => {
      console.log(res.statusCode); // Logs the final status (404, 500, etc.)
  });
  ```

### Q4: Explain the difference between Git Flow (Feature Branching) and Trunk-Based Development.
* **Answer:**
  * **Git Flow (Feature Branching):** Developers do not work directly on `main` or `dev`. Instead, for every new task/bug, they spin off a `feature/name` or `bugfix/name` branch. Once completed, they merge it into `dev` using a Pull Request (PR) where the code is reviewed. The `main` branch only contains production-ready releases.
  * **Trunk-Based Development:** Developers commit small, frequent changes directly to a single branch (usually `main`), bypassing feature branches. This requires high test coverage and feature flags to ensure incomplete code doesn't break production.

### Q5: What makes an Error-Handling Middleware different from a standard middleware in Express?
* **Answer:**
  Express identifies error-handling middleware strictly by the **arity (number of arguments)** of the function. 
  * A standard middleware has 3 arguments: `(req, res, next)`.
  * An error-handling middleware must have exactly **4 arguments**: `(err, req, res, next)`. 
  If you omit `next` (even if you don't use it), Express will treat it as a standard middleware, and it will fail to intercept thrown errors.

### Q6: Why must the Centralized Error Handler be mounted as the last middleware in `server.ts`?
* **Answer:**
  Express evaluates middleware sequentially from top to bottom. If the error handler is mounted at the top, the route handlers below it have not executed yet, meaning it cannot catch any errors thrown by those routes. Mounting it at the very bottom (after all routes) ensures it acts as a safety net catching any unhandled errors that bubble up from the routes above.

### Q7: What is the purpose of `express.json()` middleware?
* **Answer:**
  By default, Node.js HTTP servers receive request bodies as raw streams of data. `express.json()` is a built-in middleware that intercepts the incoming request, reads the raw body stream, parses it as a JSON object, and attaches it to `req.body` so that controllers can easily access it (e.g., `req.body.title`).

### Q8: What does HTTP Status Code `304 Not Modified` mean, and how does it help performance?
* **Answer:**
  It is a redirection status code indicating that the requested resource has not been modified since the last request. The client (browser) sends a header (like `If-None-Match` or `If-Modified-Since`) with the cached version's identifier. If the server detects no changes, it returns `304` *without* sending the response body. This saves bandwidth and reduces latency because the browser instantly loads the resource from its local cache.

### Q9: Why do we use TypeScript in Node/Express backends instead of plain JavaScript?
* **Answer:**
  * **Type Safety:** Catches compile-time errors (like calling undefined object properties or misspelled variables) before the code even runs.
  * **Auto-completion & Intellisense:** Helps developers see types, method signatures, and imports automatically in the editor.
  * **Maintainability:** Easier refactoring and self-documenting codebases, which is vital for large, enterprise-grade backends.

### Q10: How does Express know to route a request matching `/api/tasks/1` to a specific handler?
* **Answer:**
  Express utilizes a routing table. It splits the request path into segments. If a route is defined as `/api/tasks/:id`, the colon (`:`) marks `id` as a route parameter. Express matches the incoming request `/api/tasks/1` against this pattern, extracts the value `1`, and injects it into the request object under `req.params.id`.

---

## 📅 Day 7: Third-Party Middleware (Morgan)

### Q11: What is Third-Party Middleware, and why do we prefer it over custom-written code for common tasks?
* **Answer:**
  Third-party middleware is code written by external developers (usually published via npm packages) that can be plugged directly into an Express app. We prefer it for common tasks (such as logging, security headers, CORS, body parsing) because:
  * **Proven Reliability:** Used and tested in production by thousands of companies, minimizing bugs.
  * **Performance Optimization:** Highly optimized for execution speed and edge cases (e.g., memory management, cleanup listeners).
  * **Community Support:** Maintained and updated regularly to address security vulnerabilities and compatibility issues.

### Q12: How does Morgan calculate the response time of a request?
* **Answer:**
  Morgan tracks the start time when a request first enters the middleware stack. It then listens to the `finish` or `close` events on the response object (similar to our custom `res.on('finish', ...)`). Once that event fires, it subtracts the start time from the current time to measure the exact total execution duration in milliseconds.

### Q13: What are the differences between Morgan's 'dev' and 'combined' formats, and when should you use each?
* **Answer:**
  * **`dev` format:** A colored, concise format designed for human readability during local development. It prints basic details: method, URL, status code, response time, and content size. It is **not** suitable for production because it is unparsed and lacks details like client IP, timestamp, or User-Agent.
  * **`combined` format:** The standard Apache combined log format. It prints exhaustive details: client IP, timestamp, HTTP version, status code, size, referrer URL, and the client's User-Agent string. This is **required in production** so that log analysis systems (like ELK Stack or Datadog) can parse them for security auditing, analytics, and debugging.

### Q14: When working with TypeScript, why must we install packages like `@types/morgan` as devDependencies?
* **Answer:**
  Many legacy Node.js packages (like `morgan`) are written in plain JavaScript and do not contain TypeScript definitions. To prevent compilation errors when importing these packages, we install their community-written types (from the `@types/` namespace). These type definitions are only used during development/compilation by the TypeScript compiler and are not needed at runtime, so we install them as `devDependencies` to keep the production bundle smaller.

### Q15: How can you dynamically configure Morgan's log format depending on the environment (e.g., Development vs. Production)?
* **Answer:**
  You can check the environment variable (like `process.env.NODE_ENV`) and conditionally pass the format string to Morgan:
  ```typescript
  import morgan from 'morgan';

  const logFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
  app.use(morgan(logFormat));
  ```
  This ensures that developers get readable, colored logs locally, while production environments get structured, detailed logs suitable for analysis.

---

## 📅 Day 8: Express Routing In-Depth (Params & Queries)

### Q16: What is the core difference between `req.params` and `req.query` in Express?
* **Answer:** 
  * **`req.params` (Route Parameters):** These are dynamic segments defined directly in the URL path (e.g., `/api/tasks/:id`). They are primarily used to **identify a specific resource** (like fetching Task #1).
  * **`req.query` (Query Strings):** These are key-value pairs appended to the end of the URL after a question mark (e.g., `/api/tasks?completed=true`). They are completely optional and are primarily used for **filtering, sorting, searching, or paginating** a collection of resources.

### Q17: Why does the order of route definitions matter so much in Express when using route parameters?
* **Answer:** 
  Express evaluates routes sequentially from top to bottom. If you define a dynamic route (like `/api/tasks/:id`) *before* a static route (like `/api/tasks/recent`), a request to `/api/tasks/recent` will be caught by the dynamic route, and Express will mistakenly treat the word "recent" as the `:id` parameter! To prevent this bug, **static routes must always be defined before dynamic routes**.

### Q18: What data type does Express return when extracting values from `req.params` or `req.query`?
* **Answer:** 
  By default, all values extracted from the URL are **strings**. Even if a user visits `/api/tasks/123` or `/api/tasks?limit=5`, the values inside `req.params` and `req.query` will be the strings `"123"` and `"5"`. If you need to perform mathematical operations or strict boolean checks, you must manually parse them using `parseInt()`, `Number()`, or checking `=== "true"`.

### Q19: What is the semantic difference between returning a `404 Not Found` vs returning an empty array `[]` when fetching data?
* **Answer:** 
  * If a client requests a **specific resource by ID** (e.g., `/tasks/99`) and it doesn't exist, returning a `404 Not Found` is the correct semantic response.
# Backend Interview Preparation Notes

This file contains key interview questions and answers accumulated daily to prepare you for senior backend developer interviews.

---

## 📅 Day 6: HTTP, Express Architecture, Middleware, and Git Flow

Here are 10 critical interview questions covering what we have built and discussed so far (Days 1 to 6).

### Q1: What is the difference between a Route Handler and Middleware in Express?
* **Answer:** 
  In Express, both are technically middleware functions. However:
  * **Middleware** is designed to intercept the request-response cycle. It performs operations (like logging, authentication, parsing JSON) and either passes control to the next function using `next()`, or terminates the request early.
  * **Route Handler** (or Controller) is the *final destination* of a request. It contains the business logic to generate the response and terminates the cycle (e.g., using `res.json()` or `res.send()`). It rarely calls `next()`, unless it catches an error to forward to the centralized error handler.

### Q2: What is the difference between `req.url` and `req.originalUrl` in Express?
* **Answer:**
  * `req.url` returns the path relative to the router it is currently executing inside. If a router is mounted at `/api/tasks` and the user hits `/api/tasks/list`, inside the router `req.url` will be stripped down to `/list`.
  * `req.originalUrl` preserves the original request URL exactly as typed by the client (`/api/tasks/list`), regardless of how many nested routers it goes through. This is why we use `req.originalUrl` for global logging.

### Q3: Why does Node.js Express log a default `200` status code inside global request loggers unless we wait for the `finish` event?
* **Answer:**
  Express executes middleware in order. If a logger is placed at the top of the middleware stack, it runs *before* the route controller can process the request or change the status code (e.g., to a `404` or `500`). At the start of the request, Express assigns a default status code of `200` to the response object.
  To log the correct final status code, we must listen to the response's `finish` event:
  ```typescript
  res.on('finish', () => {
      console.log(res.statusCode); // Logs the final status (404, 500, etc.)
  });
  ```

### Q4: Explain the difference between Git Flow (Feature Branching) and Trunk-Based Development.
* **Answer:**
  * **Git Flow (Feature Branching):** Developers do not work directly on `main` or `dev`. Instead, for every new task/bug, they spin off a `feature/name` or `bugfix/name` branch. Once completed, they merge it into `dev` using a Pull Request (PR) where the code is reviewed. The `main` branch only contains production-ready releases.
  * **Trunk-Based Development:** Developers commit small, frequent changes directly to a single branch (usually `main`), bypassing feature branches. This requires high test coverage and feature flags to ensure incomplete code doesn't break production.

### Q5: What makes an Error-Handling Middleware different from a standard middleware in Express?
* **Answer:**
  Express identifies error-handling middleware strictly by the **arity (number of arguments)** of the function. 
  * A standard middleware has 3 arguments: `(req, res, next)`.
  * An error-handling middleware must have exactly **4 arguments**: `(err, req, res, next)`. 
  If you omit `next` (even if you don't use it), Express will treat it as a standard middleware, and it will fail to intercept thrown errors.

### Q6: Why must the Centralized Error Handler be mounted as the last middleware in `server.ts`?
* **Answer:**
  Express evaluates middleware sequentially from top to bottom. If the error handler is mounted at the top, the route handlers below it have not executed yet, meaning it cannot catch any errors thrown by those routes. Mounting it at the very bottom (after all routes) ensures it acts as a safety net catching any unhandled errors that bubble up from the routes above.

### Q7: What is the purpose of `express.json()` middleware?
* **Answer:**
  By default, Node.js HTTP servers receive request bodies as raw streams of data. `express.json()` is a built-in middleware that intercepts the incoming request, reads the raw body stream, parses it as a JSON object, and attaches it to `req.body` so that controllers can easily access it (e.g., `req.body.title`).

### Q8: What does HTTP Status Code `304 Not Modified` mean, and how does it help performance?
* **Answer:**
  It is a redirection status code indicating that the requested resource has not been modified since the last request. The client (browser) sends a header (like `If-None-Match` or `If-Modified-Since`) with the cached version's identifier. If the server detects no changes, it returns `304` *without* sending the response body. This saves bandwidth and reduces latency because the browser instantly loads the resource from its local cache.

### Q9: Why do we use TypeScript in Node/Express backends instead of plain JavaScript?
* **Answer:**
  * **Type Safety:** Catches compile-time errors (like calling undefined object properties or misspelled variables) before the code even runs.
  * **Auto-completion & Intellisense:** Helps developers see types, method signatures, and imports automatically in the editor.
  * **Maintainability:** Easier refactoring and self-documenting codebases, which is vital for large, enterprise-grade backends.

### Q10: How does Express know to route a request matching `/api/tasks/1` to a specific handler?
* **Answer:**
  Express utilizes a routing table. It splits the request path into segments. If a route is defined as `/api/tasks/:id`, the colon (`:`) marks `id` as a route parameter. Express matches the incoming request `/api/tasks/1` against this pattern, extracts the value `1`, and injects it into the request object under `req.params.id`.

---

## 📅 Day 7: Third-Party Middleware (Morgan)

### Q11: What is Third-Party Middleware, and why do we prefer it over custom-written code for common tasks?
* **Answer:**
  Third-party middleware is code written by external developers (usually published via npm packages) that can be plugged directly into an Express app. We prefer it for common tasks (such as logging, security headers, CORS, body parsing) because:
  * **Proven Reliability:** Used and tested in production by thousands of companies, minimizing bugs.
  * **Performance Optimization:** Highly optimized for execution speed and edge cases (e.g., memory management, cleanup listeners).
  * **Community Support:** Maintained and updated regularly to address security vulnerabilities and compatibility issues.

### Q12: How does Morgan calculate the response time of a request?
* **Answer:**
  Morgan tracks the start time when a request first enters the middleware stack. It then listens to the `finish` or `close` events on the response object (similar to our custom `res.on('finish', ...)`). Once that event fires, it subtracts the start time from the current time to measure the exact total execution duration in milliseconds.

### Q13: What are the differences between Morgan's 'dev' and 'combined' formats, and when should you use each?
* **Answer:**
  * **`dev` format:** A colored, concise format designed for human readability during local development. It prints basic details: method, URL, status code, response time, and content size. It is **not** suitable for production because it is unparsed and lacks details like client IP, timestamp, or User-Agent.
  * **`combined` format:** The standard Apache combined log format. It prints exhaustive details: client IP, timestamp, HTTP version, status code, size, referrer URL, and the client's User-Agent string. This is **required in production** so that log analysis systems (like ELK Stack or Datadog) can parse them for security auditing, analytics, and debugging.

### Q14: When working with TypeScript, why must we install packages like `@types/morgan` as devDependencies?
* **Answer:**
  Many legacy Node.js packages (like `morgan`) are written in plain JavaScript and do not contain TypeScript definitions. To prevent compilation errors when importing these packages, we install their community-written types (from the `@types/` namespace). These type definitions are only used during development/compilation by the TypeScript compiler and are not needed at runtime, so we install them as `devDependencies` to keep the production bundle smaller.

### Q15: How can you dynamically configure Morgan's log format depending on the environment (e.g., Development vs. Production)?
* **Answer:**
  You can check the environment variable (like `process.env.NODE_ENV`) and conditionally pass the format string to Morgan:
  ```typescript
  import morgan from 'morgan';

  const logFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
  app.use(morgan(logFormat));
  ```
  This ensures that developers get readable, colored logs locally, while production environments get structured, detailed logs suitable for analysis.

---

## 📅 Day 8: Express Routing In-Depth (Params & Queries)

### Q16: What is the core difference between `req.params` and `req.query` in Express?
* **Answer:** 
  * **`req.params` (Route Parameters):** These are dynamic segments defined directly in the URL path (e.g., `/api/tasks/:id`). They are primarily used to **identify a specific resource** (like fetching Task #1).
  * **`req.query` (Query Strings):** These are key-value pairs appended to the end of the URL after a question mark (e.g., `/api/tasks?completed=true`). They are completely optional and are primarily used for **filtering, sorting, searching, or paginating** a collection of resources.

### Q17: Why does the order of route definitions matter so much in Express when using route parameters?
* **Answer:** 
  Express evaluates routes sequentially from top to bottom. If you define a dynamic route (like `/api/tasks/:id`) *before* a static route (like `/api/tasks/recent`), a request to `/api/tasks/recent` will be caught by the dynamic route, and Express will mistakenly treat the word "recent" as the `:id` parameter! To prevent this bug, **static routes must always be defined before dynamic routes**.

### Q18: What data type does Express return when extracting values from `req.params` or `req.query`?
* **Answer:** 
  By default, all values extracted from the URL are **strings**. Even if a user visits `/api/tasks/123` or `/api/tasks?limit=5`, the values inside `req.params` and `req.query` will be the strings `"123"` and `"5"`. If you need to perform mathematical operations or strict boolean checks, you must manually parse them using `parseInt()`, `Number()`, or checking `=== "true"`.

### Q19: What is the semantic difference between returning a `404 Not Found` vs returning an empty array `[]` when fetching data?
* **Answer:** 
  * If a client requests a **specific resource by ID** (e.g., `/tasks/99`) and it doesn't exist, returning a `404 Not Found` is the correct semantic response.
  * If a client requests a **collection of resources with a filter** (e.g., `/tasks?completed=true`) and no items match that filter, the correct response is usually a `200 OK` with an empty array `[]`. The endpoint itself exists and successfully processed the query; there just happened to be no matching data.

### Q20: Is it possible to have multiple route parameters in a single URL?
* **Answer:** 
  Yes, absolutely. You can define multiple parameters in a single path separated by slashes (e.g., `/api/users/:userId/tasks/:taskId`). Express will extract all of them automatically and place them inside the `req.params` object (so you can access `req.params.userId` and `req.params.taskId` simultaneously).

---

## 📅 Day 9: Environment Variables (`.env`) & Configuration

### Q21: What are Environment Variables, and why do we use them in backend development?
* **Answer:** 
  Environment variables are key-value pairs stored completely outside of the application code, usually provided by the operating system or the hosting provider. We use them for two main reasons:
  1. **Security:** To keep highly sensitive data (like database connection strings, API keys, and JWT secrets) out of the source code.
  2. **Configuration:** To allow the application to change behavior based on where it is running (e.g., running on `PORT=5000` locally, but `PORT=80` in production) without ever touching the code itself.

### Q22: Why must the `.env` file always be added to `.gitignore`?
* **Answer:** 
  If `.env` is not added to `.gitignore`, Git will track it and upload it to your remote repository (like GitHub). If the repository is public, anyone on the internet can instantly scrape your database passwords and API keys, leading to severe data breaches and compromised servers. 

### Q23: How does the `dotenv` package work under the hood in a Node.js application?
* **Answer:** 
  By default, Node.js has no built-in mechanism to read `.env` files. The `dotenv` package solves this by reading the `.env` file from the root directory, parsing the text into key-value pairs, and silently injecting them into Node.js's global `process.env` object. This makes those variables accessible anywhere in your code via `process.env.VARIABLE_NAME`.

### Q24: What is the specific purpose of the `NODE_ENV` environment variable?
* **Answer:** 
  `NODE_ENV` is a universal convention in the Node.js ecosystem used to specify the environment the application is currently running in (usually `development`, `production`, or `test`). Many libraries, including Express and Morgan, automatically check `process.env.NODE_ENV` to optimize their behavior. For instance, in `production`, Express caches templates and drastically reduces error stack traces to improve performance and security.

### Q25: Why is it considered best practice to centralize environment variables into a single configuration file (e.g., `src/config/env.ts`) instead of using `process.env` everywhere?
* **Answer:** 
  If you sprinkle `process.env.DB_URL` throughout 50 different files, and that variable is missing from the `.env` file, your app might crash unpredictably deep inside a random file. By centralizing them in one configuration file, you can immediately check if all required variables exist right when the server starts. If a critical variable is missing, you can intentionally throw an error immediately ("Fail Fast"), and you can also provide safe default values all in one place.

---

## 📅 Day 10: Building the Core Task CRUD Routes

### Q26: What does the acronym CRUD stand for, and how do its operations map to RESTful HTTP methods?
* **Answer:** 
  CRUD stands for **Create, Read, Update, and Delete**. In a standard REST API, these database operations map directly to specific HTTP methods:
  * **Create** ➔ `POST`
  * **Read** ➔ `GET`
  * **Update** ➔ `PUT` (or `PATCH`)
  * **Delete** ➔ `DELETE`

### Q27: What is the strict semantic difference between the `PUT` and `PATCH` HTTP methods?
* **Answer:** 
  Both are used for updating resources, but they have different rules:
  * **`PUT`** is meant for **full replacement**. If a task has `title` and `completed` fields, and you send a `PUT` request with only the `title`, the server is technically supposed to wipe out the `completed` field (or revert it to default).
  * **`PATCH`** is meant for **partial updates**. If you send a `PATCH` request with only the `title`, the server updates just the `title` and leaves all other existing fields exactly as they were. 
  *(Note: While these are the strict REST definitions, many developers casually use `PUT` for partial updates in the real world).*

### Q28: When successfully creating a new resource via a `POST` request, what HTTP status code should the server return?
* **Answer:** 
  The server should return `201 Created`. While returning a standard `200 OK` works and won't crash the app, `201 Created` is semantically correct. It explicitly communicates to the frontend client that their request resulted in a brand-new record being generated in the database.

### Q29: Why do `POST` and `PUT` requests require `express.json()` middleware, but `GET` and `DELETE` requests usually do not?
* **Answer:** 
  `POST` and `PUT` operations require the client to send a payload of data (like a new task object) inside the **Request Body**. The `express.json()` middleware is necessary to intercept and parse that raw body stream into a usable JavaScript object (`req.body`). Conversely, `GET` and `DELETE` requests almost never use a body; they transmit their required data entirely through the URL (via route parameters like `/:id` or query strings like `?sort=asc`), meaning body-parsing middleware is ignored.

### Q30: In our `updateTask` controller, why did modifying the object returned by `tasks.find()` automatically update the array? We never pushed it back in!
* **Answer:** 
  This happens because, in JavaScript, objects are passed by **reference**, not by value. When `tasks.find()` locates a task, it doesn't return a copy of the task; it returns a direct memory reference to the exact object sitting inside the array. Therefore, doing `task.title = "New Title"` instantly mutates the original object inside the array. No `.push()` or array reassignment is necessary!

---

## 📅 Day 11: RESTful Principles & JSON Formatting

### Q31: What is REST, and what are its core principles?
* **Answer:** 
  REST (Representational State Transfer) is an architectural style for designing networked APIs. Its core principles include:
  1. **Client-Server Architecture:** Complete separation between the frontend UI and the backend data.
  2. **Statelessness:** The server retains no memory of the client between requests.
  3. **Uniform Interface:** Predictable URIs and standardized use of HTTP methods.

### Q32: What exactly does it mean for an API to be "Stateless"?
* **Answer:** 
  Statelessness means that every single HTTP request from the client must contain all the information the server needs to process it. The server does not "remember" the client from previous requests. For example, if a user is logged in, they must attach their authentication token to every single request they send, because the server forgets who they are the moment the previous request finishes.

### Q33: Why is it highly recommended to use a standard "JSON Envelope" (like JSend) instead of returning raw objects or arrays?
* **Answer:** 
  A standard envelope (e.g., `{ success: true, data: [...] }`) provides predictability for frontend developers. They always know exactly how to parse the response (checking `response.data.success` first), regardless of whether it's an error, a single object, or an array. It also makes the API scalable, allowing developers to easily add metadata (like pagination details) to the envelope without breaking the core `data` structure.

### Q34: In a REST API, why is the endpoint `GET /api/deleteTask/:id` considered an anti-pattern?
* **Answer:** 
  It violates the Uniform Interface principle. In REST, the URL route should represent the **resource** itself (the noun, like `/api/tasks`), while the HTTP method should represent the **action** being taken (the verb, like `DELETE`). The correct and standard approach is `DELETE /api/tasks/:id`.

### Q35: If a client requests a resource that does not exist, what should the response look like?
* **Answer:** 
  The HTTP status code must be `404 Not Found`. Additionally, the JSON envelope should cleanly indicate the failure so the frontend can display an error, for example: `{ "success": false, "message": "Task not found" }`.

---

## 📅 Day 12: File System & Data Persistence

### Q36: Why can't we just store application data in a JavaScript array?
* **Answer:** 
  A JavaScript array is stored in the computer's volatile memory (RAM). This means every time the Node.js server restarts or crashes, all the data is permanently lost. For a real application, data must be **persistent** (saved permanently on a hard drive).

### Q37: What is the Node.js `fs` module?
* **Answer:** 
  The `fs` (File System) module is a built-in Node.js module that allows your JavaScript code to interact with the server's hard drive. It provides methods to read, write, update, and delete physical files and folders.

### Q38: What is the difference between `fs.readFileSync` and `fs.promises.readFile`?
* **Answer:** 
  `fs.readFileSync` is **synchronous (blocking)**. It completely halts the entire Node.js server until the file is read, making all other users wait. `fs.promises.readFile` is **asynchronous (non-blocking)**. It reads the file in the background, allowing the server to continue handling requests from other users simultaneously.

### Q39: Why is synchronous (blocking) code considered bad practice in web servers?
* **Answer:** 
  Because Node.js runs on a **Single Thread**, if a synchronous operation (like reading a huge file) blocks that thread, the entire server freezes. No other user can connect or get a response until that operation finishes, leading to terrible performance and timeouts.

### Q40: When you read a `.json` file using the `fs` module, what format is the data in, and how do you use it in JavaScript?
* **Answer:** 
  The `fs` module reads the file as plain **text (a string)**. To use it in JavaScript as an actual object or array, you must parse it using `JSON.parse(data)`. Conversely, before writing it back to the file, you must convert it back to a string using `JSON.stringify(data)`.

### Q41: In an Express controller, what happens when you pass an argument to `next()`, such as `next(error)`?
* **Answer:** 
  By default, `next()` simply passes control to the very next middleware in the stack. However, if you pass **any argument** to it (e.g., `next(error)`), Express assumes that a fatal error has occurred. It will instantly skip all remaining standard middlewares and route handlers, and jump directly to the **Centralized Error Handling Middleware** (the one with 4 parameters: `err, req, res, next`) to log the error and send a generic 500 response to the client.

### Q42: In TypeScript, why do asynchronous functions have return types like `Promise<Task[]>` or `Promise<void>` instead of just `Task[]` or `void`?
* **Answer:** 
  Any function marked with the `async` keyword inherently runs in the background and must return a `Promise`. The syntax inside the angle brackets `< >` simply dictates what the Promise will yield when it successfully resolves. 
  * `Promise<Task[]>` means: *"When I finish my background work, I will hand you an array of Tasks."*
  * `Promise<void>` means: *"I will do some background work (like saving a file), but when I am done, I will return absolutely nothing (`void`)."*

---

## 📅 Day 13: Input Validation (Zod)

### Q43: Why shouldn't we trust data coming from the client?
* **Answer:** 
  Clients (whether users, scripts, or malicious actors) can send anything in an HTTP request. If you expect a `title` string but they send an array or an SQL injection payload, and you don't validate it, your server will crash or your database will be compromised. "Never trust the client" is the golden rule of backend security.

### Q44: What is Zod, and why is it preferred over manual `if/else` checks for validation?
* **Answer:** 
  Zod is a TypeScript-first schema declaration and validation library. Instead of writing dozens of `if (!req.body.title || typeof req.body.title !== 'string')` checks, you define a single "Schema" (a blueprint). Zod automatically validates the incoming data against the blueprint and provides excellent, human-readable error messages if it fails.

### Q45: How does a Validation Middleware work in Express?
* **Answer:** 
  It is a Higher-Order Function (a function that returns a middleware). You pass a Zod schema into the function. The middleware intercepts the request, runs `schema.parseAsync(req.body)`, and if the data is valid, it calls `next()` to pass control to the controller. If the data is invalid, it catches the `ZodError` and immediately returns a `400 Bad Request` response, preventing the bad data from ever reaching the controller.

---

## 📅 Day 14: Pagination

### Q46: What is Pagination and why is it crucial for REST APIs?
* **Answer:** 
  Pagination is the process of dividing a large dataset into smaller chunks (pages). It is crucial because if a database has 10 million records and a user requests them all, sending them in a single massive JSON response will overload the server's memory, consume massive bandwidth, and crash the user's browser.

### Q47: How is Pagination typically implemented using Query Parameters?
* **Answer:** 
  The client sends `page` (the current page number) and `limit` (the number of items per page) in the URL query string (e.g., `?page=2&limit=10`). The backend calculates the starting index and ending index based on these parameters and returns only that specific slice of data.

### Q48: What metadata should a paginated API response include alongside the data array?
* **Answer:** 
  A good API should always return pagination metadata so the frontend knows how to build its UI (like "Next" and "Previous" buttons). This usually includes: `currentPage`, `itemsPerPage`, `totalItems`, and `totalPages`.

---

## 📅 Day 15: Filtering & Sorting

### Q49: What is the correct "Order of Operations" when a user requests Filtering, Sorting, and Pagination all at once?
* **Answer:** 
  The operations **must** be executed in this exact order:
  1. **Filter:** Remove the data the user doesn't want (e.g., removing uncompleted tasks).
  2. **Sort:** Organize the remaining data (e.g., sorting the completed tasks by date).
  3. **Paginate:** Slice the organized data to return only the requested page.
  Doing it in any other order (like paginating *before* sorting) will result in broken, inaccurate data.

### Q50: How do you handle default values for query parameters if the user doesn't provide them?
* **Answer:** 
  If a user visits `/api/tasks` without query parameters, the backend should always fall back to sensible defaults to prevent the app from breaking. For example, using the logical OR operator: `const page = parseInt(req.query.page) || 1;` and `const sortBy = req.query.sortBy || 'createdAt';`.

---

## 📅 Day 16: File Uploads & Multer

### Q51: What is the difference between `application/json` and `multipart/form-data`?
* **Answer:** 
  `application/json` is used for sending plain text data (like strings, numbers, and booleans) formatted as a JSON object. However, JSON cannot transmit binary files (like images, videos, or PDFs). To send files from a frontend to a backend, the request must use `multipart/form-data`, which breaks the HTTP request into multiple distinct "parts" so text data and binary data can travel together.

### Q52: What is Multer and why is it necessary in an Express application?
* **Answer:** 
  By default, Express cannot parse `multipart/form-data` requests. If a client sends an image, Express will just see unreadable binary gibberish. Multer is a third-party Node.js middleware specifically designed to parse `multipart/form-data`. It intercepts the request, extracts the binary file chunks, assembles them, saves the physical file to the server's hard drive, and attaches the file's metadata to the `req.file` object for the controller to use.

### Q53: How do you configure Multer middleware for a single file upload in a route?
* **Answer:** 
  You use the `upload.single('fieldname')` method as a middleware. The string passed to it must exactly match the Key name used in the frontend's `form-data` request.
  ```typescript
  import { upload } from '../middlewares/upload.middleware.js';
  
  // This expects exactly one file attached to the 'image' field
  router.post('/tasks', upload.single('image'), createTask);
  ```

### Q54: Where does Multer store the uploaded file information, and how do you access it in the controller?
* **Answer:** 
  For a single file upload, Multer automatically saves the physical file to the hard drive, and then attaches an object containing the file's metadata to `req.file`. The controller can then read `req.file.filename` to save the path to the database.
  ```typescript
  export const createTask = async (req: Request, res: Response) => {
      // If a file was uploaded, generate the URL path string
      const imageUrl = req.file ? '/uploads/' + req.file.filename : undefined;
      
      // Save imageUrl to database...
  };
  ```

### Q55: How do you handle a scenario where a user needs to upload multiple different types of files (e.g., a Profile Picture and a PDF Resume) in a single request?
* **Answer:** 
  Instead of using `upload.single('image')`, you would use Multer's `upload.fields()` method. You define an array of expected fields (e.g., `[{ name: 'profilePic', maxCount: 1 }, { name: 'resume', maxCount: 1 }]`). Multer will then process all of them and provide a `req.files` object containing arrays for each specific field name, allowing the controller to safely route the different files to their respective database columns.

---
## 📅 Day 17: API Security & Rate Limiting

### Q56: What is a DDoS attack, and how does API Rate Limiting prevent it?
* **Answer:** 
  A DDoS (Distributed Denial of Service) attack occurs when malicious actors flood an API with thousands of fake requests per second, causing the server's CPU and Memory to crash. API Rate Limiting prevents this by tracking the IP address of every incoming request. If a single IP address sends more requests than a defined threshold (e.g., 100 requests per 15 minutes), the server automatically blocks them, preserving resources for legitimate users.

### Q57: In Express, how do you apply a global rate limit to all routes?
* **Answer:** 
  You use a middleware package like `express-rate-limit`. You define the configuration window and the maximum allowed requests. Then, you place `app.use(globalLimiter)` near the top of your `server.ts` file so that every incoming request passes through the limiter before hitting the route handlers.

### Q58: What HTTP Status code is returned when a client exceeds the rate limit?
* **Answer:** 
  The server returns a `429 Too Many Requests` status code.

---

## 📅 Day 18: Architecture & Refactoring (DRY & SoC)

### Q59: What does the DRY principle stand for, and why is it critical in software engineering?
* **Answer:** 
  DRY stands for "Don't Repeat Yourself." It dictates that every piece of logic should have a single, unambiguous representation in the system. If you find yourself copying and pasting the exact same database reading logic into 5 different controllers, you are violating DRY. It is critical because if a bug is found in that logic, a DRY codebase only requires one fix in one file, whereas repeated code requires tracking down and fixing the bug in 5 different places.

### Q60: What is the Separation of Concerns (SoC), and how does the `utils` folder help achieve it?
* **Answer:** 
  Separation of Concerns is an architectural principle stating that different files/folders should have completely distinct responsibilities. A Controller should only care about HTTP Requests and Responses. It should not care about *how* the hard drive reads a file. The `utils` folder helps achieve this by holding isolated, reusable "helper" functions (like `readTasks()`). The controller simply calls the utility function, maintaining a clean separation of HTTP logic from file-system logic.

### Q61: What is the difference between a `utils` folder and a `services` folder?
* **Answer:** 
  A `utils` folder holds small, generic, reusable helper functions that do not contain core business rules (e.g., formatting dates, generating IDs, reading raw files). A `services` folder holds complex **Business Logic** (e.g., verifying inventory, calculating taxes, and charging a credit card during an E-Commerce checkout). In a simple CRUD app, `utils` is enough, but enterprise apps heavily rely on a `services` layer to keep controllers clean.

---

## 📅 Day 19: API Documentation (Swagger)

### Q62: Why is API Documentation crucial for Backend Developers to provide to Frontend Developers?
* **Answer:** 
  Without documentation, a frontend developer has no idea how to consume an API. They don't know the exact URL endpoints, whether to use GET or POST, what the expected JSON request body looks like, or what Query Parameters (like `?page=1`) are supported. Documentation acts as the instruction manual, allowing frontend and backend teams to work independently.

### Q63: What is Swagger (OpenAPI) and how is it generated in an Express application?
* **Answer:** 
  Swagger (now officially OpenAPI) is the industry standard format for API documentation. It generates a beautiful, interactive web dashboard where developers can read about and directly test API routes. In Express, it is typically generated using `swagger-jsdoc` (which reads YAML comments written directly above route definitions) and `swagger-ui-express` (which renders the HTML/CSS dashboard).

### Q64: Why is it dangerous to leave Swagger documentation exposed in a Production environment, and how do you secure it?
* **Answer:** 
  While Swagger is amazing for development teams, it is highly dangerous in a live Production environment because it acts as a perfect blueprint for hackers. It shows them exactly what endpoints exist and what data schemas to attack. To secure it, professional developers wrap the Swagger setup in an environment check: `if (process.env.NODE_ENV !== 'production') { setupSwagger(app); }`. This ensures the documentation is entirely hidden on the live internet.

### Q65: What is "Deep Linking" in Swagger UI and why is it useful?
* **Answer:** 
  Deep Linking allows developers to share a specific URL (containing a hash anchor, like `#/Tasks/get_api_tasks`) that automatically scrolls the browser down to a specific route's documentation block. This saves immense time when collaborating with frontend developers over Slack, as they are taken directly to the specific endpoint rather than having to search a massive documentation page manually.

## 📅 Day 20: Code Cleanup & Refactoring

### Q66: What is the "Boy Scout Rule" in software engineering?
* **Answer:** 
  The Boy Scout Rule states: "Always leave the code cleaner than you found it." In professional software development, this means that whenever you open a file to add a new feature or fix a bug, you should also take a moment to fix poor variable names, delete unused imports, or add missing comments in that file. Small, continuous cleanups prevent "technical debt" from accumulating over time.

### Q67: Why is it critical to remove "dead code" (like temporary test routes or unused variables) before merging to the production `main` branch?
* **Answer:** 
  "Dead code" creates severe confusion and maintenance overhead. If a new developer inherits a codebase and sees a route like `/api/test`, they won't know if it is safe to delete or if some critical system secretly relies on it. Furthermore, temporary testing routes often bypass security protocols (like authentication or rate limiting), creating massive security vulnerabilities if pushed to production. Dead code should always be deleted before a PR is merged.

---
*End of Month 1 Project 1 Interview Notes.*
