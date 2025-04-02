import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (_, res) => {
  res.send('🚀 App deployed successfully from GitHub Actions to EC2!');
});

app.get('/', (_, res) => {
  res.send('🎉 TypeScript Express Server is running!');
});
app.get('/health', (_, res) => {
  res.send('OK');
});

export default app;
