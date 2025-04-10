import http from 'http';
import app from './app.js';
import { testConnection, sequelize } from './config/db.js';

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

const startServer = async () => {
  console.log(`🔁 Initializing backend server on port ${PORT}...`);

  await testConnection();

  try {
    console.log('⏳ Synchronizing database models...');
    await sequelize.sync();
    console.log('✅ Database models synchronized successfully.');
  } catch (error) {
    console.error('❌ Sequelize sync failed:', error);
    process.exit(1);
  }

  server.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
  });
};

startServer();

const shutdown = async () => {
  console.log('\n🛑 Shutting down server gracefully...');

  server.close(async () => {
    console.log('🔒 HTTP server closed.');

    try {
      await sequelize.close();
      console.log('🗄️ Database connection closed.');
      process.exit(0);
    } catch (err) {
      console.error('❌ Error during shutdown:', err);
      process.exit(1);
    }
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
