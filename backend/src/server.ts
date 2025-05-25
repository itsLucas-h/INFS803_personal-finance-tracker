import http from 'http';
import app from './app.js';
import { testConnection, sequelize } from './config/db.js';

const PORT = parseInt(process.env.PORT || '5000', 10);
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const BACKEND_URL = process.env.BACKEND_URL || `http://localhost:${PORT}`;

const server = http.createServer(app);

const startServer = async () => {
  console.log(`Starting backend server on port ${PORT}...`);

  try {
    await testConnection();
    console.log('Database connection established.');

    console.log('Synchronising database models...');
    await sequelize.sync();
    console.log('Database models synchronised.');
  } catch (error) {
    console.error('Startup failed:', error);
    process.exit(1);
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log('------------------------------------------');
    console.log(`Backend URL:  ${BACKEND_URL}`);
    console.log(`Localhost:    http://localhost:${PORT}`);
    console.log('');
    console.log(`Frontend URL: ${FRONTEND_URL}`);
    console.log(`Localhost:    http://localhost:3000`);
    console.log('------------------------------------------');
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
      console.error('Shutdown error:', err);
      process.exit(1);
    }
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
