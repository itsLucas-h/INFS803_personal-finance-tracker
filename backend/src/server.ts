import http from 'http';
import app from './app.js';
import { testConnection, sequelize } from './config/db.js';

const PORT: number = parseInt(process.env.PORT || '5000', 10);
const server = http.createServer(app);

const startServer = async () => {
  console.log(`Starting backend server on port ${PORT}...`);

  await testConnection();

  try {
    console.log('Synchronising database models...');
    await sequelize.sync();
    console.log('Database models synchronised successfully.');
  } catch (error) {
    console.error('Sequelize sync failed:', error);
    process.exit(1);
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running at http://0.0.0.0:${PORT}`);
  });
};

startServer();

const shutdown = async () => {
  console.log('\nShutting down server gracefully...');

  server.close(async () => {
    console.log('HTTP server closed.');

    try {
      await sequelize.close();
      console.log('Database connection closed.');
      process.exit(0);
    } catch (err) {
      console.error('Error during shutdown:', err);
      process.exit(1);
    }
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
