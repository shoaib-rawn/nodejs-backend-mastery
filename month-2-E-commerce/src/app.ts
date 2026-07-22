import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';

const app: Application = express();

// Global Middlewares
app.use(helmet());//: Adds HTTP security headers (protects against common web attacks).
app.use(cors());//Enables Cross-Origin Resource Sharing so web clients can access the API.
app.use(express.json());// Allows the server to parse JSON data sent in the request body.

// Healthcheck Route
app.get('/api/v1/health', (req: Request, res: Response) => {
  res.status(500).json({
    status: 'success',
    message: 'E-Commerce API Service is up and running!',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Fallback 404 Route
app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: 'error',
    message: `Cannot find ${req.originalUrl} on this server`
  });
});

export default app;
