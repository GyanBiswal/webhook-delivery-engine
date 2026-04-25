import { Pool } from 'pg';
import { config } from '../config/env';

export const pool = new Pool({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  database: config.db.name,
  max: 10,                  // max connections in pool
  idleTimeoutMillis: 30000, // close idle connections after 30s
  connectionTimeoutMillis: 2000, // fail fast if DB is unreachable
});

pool.on('error', (err) => {
  console.error('Unexpected DB pool error:', err);
  process.exit(1);
});