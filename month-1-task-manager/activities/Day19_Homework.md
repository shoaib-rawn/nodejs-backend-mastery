# Day 19: Homework & Activities

Today's goal is to create a beautiful, interactive documentation page for your Task Manager API!

## Task 1: Installation
Open your terminal and install the Swagger tools:
```bash
npm install swagger-ui-express swagger-jsdoc
npm install -D @types/swagger-ui-express @types/swagger-jsdoc
```

## Task 2: Create the Swagger Config File
1. Inside your `src/utils/` folder, create a file called `swagger.ts`.
2. This file will hold the basic configuration (like your API title, version, and the location of your routes).
```typescript
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import type { Application } from 'express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Task Manager API',
      version: '1.0.0',
      description: 'A simple REST API for managing tasks',
    },
    servers: [
      {
        url: 'http://localhost:5000',
      },
    ],
  },
  apis: ['./src/routes/*.ts'], // Path to the API routes
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Application) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log('📄 Swagger Docs available at http://localhost:5000/api-docs');
};
```

## Task 3: Attach it to your Server
1. Open `server.ts`.
2. Import `setupSwagger` from `src/utils/swagger.js`.
3. Call `setupSwagger(app)` right above `app.listen`.

## Task 4: Test it!
1. Start your server with `npm run dev`.
2. Open your web browser and go to: `http://localhost:5000/api-docs`
3. You should see a beautiful Swagger page! (It will be empty for now because we haven't added comments to our routes yet, but the page itself will load!).

## Task 5: Document Your Routes
1. Open `src/routes/task.routes.ts`.
2. Write a unique JSDoc block starting with `/** @swagger` directly above every single route (GET, POST, PUT, DELETE) using standard OpenAPI YAML syntax.
3. This is what populates the actual HTTP methods in the web interface!

## Task 6: Secure Swagger for Production
Leaving Swagger exposed in Production is a massive security risk! Hackers can use it as a map to attack your API.
1. Open `server.ts`.
2. Wrap the `setupSwagger(app)` call inside an `if` statement so it only runs locally:
```typescript
if (process.env.NODE_ENV !== 'production') {
    setupSwagger(app);
}
```

## Task 7: Document Query Parameters
If you do not document your query parameters, frontend developers will never know they can paginate or filter!
1. Under the `GET /api/tasks` Swagger block, add a `parameters` array.
2. Define `page`, `limit`, `completed`, `sortBy`, and `order`.
3. Now, Swagger will give you text boxes and dropdowns to test filtering directly in the browser!

## Task 8: Clean Up Terminal Logs
Loading the Swagger UI downloads a lot of CSS and JS files in the background, which clutters your terminal logs.
1. Open `server.ts`.
2. Update your `morgan` logger to ignore the Swagger URL:
```typescript
app.use(morgan(logFormat, {
    skip: (req, res) => req.originalUrl.startsWith('/api-docs')
}));
```
