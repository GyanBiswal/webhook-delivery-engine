import { pool } from '../db/client';
import { CreateWebhookDTO, Webhook } from '../types/webhook.types';

export async function createWebhook(data: CreateWebhookDTO): Promise<Webhook> {
  const { url, secret, event_types } = data;

  const result = await pool.query<Webhook>(
    `INSERT INTO webhooks (url, secret, event_types)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [url, secret, event_types]
  );

  return result.rows[0];
}

export async function listWebhooks(): Promise<Webhook[]> {
  const result = await pool.query<Webhook>(
    `SELECT id, url, event_types, is_active, created_at
     FROM webhooks
     ORDER BY created_at DESC`
  );

  return result.rows;
}

export async function getWebhookById(id: string): Promise<Webhook | null> {
  const result = await pool.query<Webhook>(
    `SELECT id, url, event_types, is_active, created_at
     FROM webhooks
     WHERE id = $1`,
    [id]
  );

  return result.rows[0] || null;
}