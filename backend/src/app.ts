import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import transactionRoutes from './routes/transaction.routes';

dotenv.config();

const app: Application = express();

app.use(cors());
app.use(express.json());

app.get('/', (_: Request, res: Response) => {
  res.send('🚀 Server is up and running!');
});

app.get('/health', (_: Request, res: Response) => {
  res.send('✅ Server is healthy');
});

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/transactions', transactionRoutes);

export default app;
