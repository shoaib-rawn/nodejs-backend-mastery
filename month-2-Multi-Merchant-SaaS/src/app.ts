import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { checkDbConnection } from './config/db.config';

const app: Application = express();

// Global Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// Healthcheck Route (Tests Express API & PostgreSQL Connection)
app.get('/api/v1/health', async (req: Request, res: Response) => {
  const db = await checkDbConnection();

  res.status(db.isConnected ? 200 : 500).json({
    status: db.isConnected ? 'success' : 'error',
    message: db.isConnected
      ? 'E-Commerce API Service and PostgreSQL are running!'
      : 'API is running, but PostgreSQL connection failed',
    database: db
  });
});

export default app;
