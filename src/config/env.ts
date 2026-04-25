import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || '3000',
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER || 'webhook_user',
    password: process.env.DB_PASSWORD || 'webhook_pass',
    name: process.env.DB_NAME || 'webhook_db',
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
  },
};  