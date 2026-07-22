import 'dotenv/config';
import express, { type Application, type Request, type Response, type NextFunction } from 'express';
import taskRoutes from './src/routes/task.routes.js';
import morgan from 'morgan';
import { errorHandler } from './src/middlewares/error.middleware.js';
import { globalLimiter } from './src/middlewares/rateLimiter.middleware.js';
import { setupSwagger } from './src/utils/swagger.js';

// Initialize Express App
const app: Application = express();

// Middleware to parse JSON body data
app.use(express.json());

// Apply Rate Limiting to all requests
app.use(globalLimiter);

// HTTP request logger middleware
const logFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
app.use(morgan(logFormat, {
    skip: (req, res) => req.originalUrl.startsWith('/api-docs')
}));

// Task Manager API Routes (Imported from src/routes)
app.use('/api/tasks', taskRoutes);


// Setup Swagger API Documentation (Development only for security!)
if (process.env.NODE_ENV !== 'production') {
    setupSwagger(app);
}

// CENTRALIZED ERROR HANDLER (Must be the last middleware before app.listen)
app.use(errorHandler);
// Define the port to listen on
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
