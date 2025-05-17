import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import { apiLimiter } from './middleware/rateLimit.middleware.js';

import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import transactionRoutes from './routes/transaction.routes.js';
import goalRoutes from './routes/goal.routes.js';
import budgetRoutes from './routes/budget.routes.js';
import reportRoutes from './routes/report.routes.js';
import fileRoutes from './routes/file.routes.js';

dotenv.config();

const app: Application = express();

// Add your deployed frontend IP or domain here
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'http://localhost:3000',
  'http://3.27.192.56:3000', // replace with your EC2 IP if different
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`🚫 Blocked by CORS: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use(helmet());
app.use(apiLimiter);

app.get('/', (_: Request, res: Response) => {
  res.send('🚀 Server is up and running!');
});

app.get('/health', (_: Request, res: Response) => {
  res.send('✅ Server is healthy');
});

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/files', fileRoutes);

export default app;
