import { pool } from './client';

async function migrate() {
  console.log('Running migrations...');

  await pool.query(`
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";

    CREATE TABLE IF NOT EXISTS webhooks (
      id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      url         TEXT NOT NULL,
      secret      TEXT NOT NULL,
      event_types TEXT[] NOT NULL,
      is_active   BOOLEAN NOT NULL DEFAULT true,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS events (
      id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      webhook_id  UUID NOT NULL REFERENCES webhooks(id) ON DELETE CASCADE,
      event_type  TEXT NOT NULL,
      payload     JSONB NOT NULL,
      status      TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending', 'delivered', 'failed')),
      created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS delivery_attempts (
      id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      event_id       UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
      attempt_number INT NOT NULL DEFAULT 1,
      status         TEXT NOT NULL
                     CHECK (status IN ('success', 'failure')),
      response_code  INT,
      error_message  TEXT,
      attempted_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_events_webhook_id ON events(webhook_id);
    CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
    CREATE INDEX IF NOT EXISTS idx_delivery_attempts_event_id 
      ON delivery_attempts(event_id);
  `);

  console.log('Migrations complete');
  await pool.end();
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});