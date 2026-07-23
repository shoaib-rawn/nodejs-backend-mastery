import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { getDatabaseConfig } from './config/db.config.js';

const app: Application = express();

// Global Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// Healthcheck Route
app.get('/api/v1/health', (req: Request, res: Response) => {
  const dbConfig = getDatabaseConfig();

  res.status(200).json({
    status: 'success',
    message: 'E-Commerce API Service is up and running!',
    version: '1.0.0',
    database: {
      isConfigured: dbConfig.isConfigured,
      host: dbConfig.host,
      port: dbConfig.port,
      databaseName: dbConfig.database
    },
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
