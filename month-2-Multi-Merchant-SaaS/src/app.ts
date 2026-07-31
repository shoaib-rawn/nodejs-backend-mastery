import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { checkDbConnection } from './config/db.config';
import authRouter from './routes/auth.routes';
import storeRouter from './routes/store.routes';
import productRouter from './routes/product.routes';

const app: Application = express();

// Global Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(cookieParser()); // Enables reading incoming cookies from request payloads

// Route Registration
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/stores', storeRouter);
app.use('/api/v1/products', productRouter);

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
