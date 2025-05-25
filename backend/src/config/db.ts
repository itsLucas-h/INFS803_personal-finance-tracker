import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const isTestEnv = process.env.NODE_ENV === 'test';

if (!isTestEnv) {
  const requiredEnvVars = ['DB_NAME', 'DB_USER', 'DB_PASSWORD', 'DB_HOST'];
  requiredEnvVars.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  });
}

const dbConfig = {
  database: process.env.DB_NAME || '',
  username: process.env.DB_USER || '',
  password: process.env.DB_PASSWORD || '',
  options: {
    host: process.env.DB_HOST,
    dialect: 'postgres' as const,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
};

export const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  dbConfig.options,
);

export const testConnection = async (retries = 3, delay = 2000) => {
  while (retries > 0) {
    try {
      await sequelize.authenticate();
      console.log('PostgreSQL connected successfully!');
      return;
    } catch (err: any) {
      console.error('DB connection error:', err.message || err);
      retries--;
      if (retries > 0) {
        console.log(`🔁 Retrying DB connection... (${retries} retries left)`);
        await new Promise((res) => setTimeout(res, delay));
      } else {
        console.error('Failed to connect to the DB after retries. Exiting.');
        process.exit(1);
      }
    }
  }
};
