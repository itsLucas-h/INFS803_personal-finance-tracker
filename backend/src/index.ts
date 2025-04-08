import app from './app';
import { testConnection, sequelize } from './config/db';

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`🔧 Starting backend on port ${PORT}...`);

  await testConnection();

  try {
    console.log('⏳ Syncing database models...');
    await sequelize.sync();
    console.log('✅ All models synchronized successfully.');
  } catch (err) {
    console.error('❌ Failed to sync Sequelize models:', err);
  }

  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
