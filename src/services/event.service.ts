import { pool } from '../db/client';
import { CreateEventDTO, WebhookEvent } from '../types/event.types';

export async function createEvents(data: CreateEventDTO): Promise<WebhookEvent[]> {
  const { event_type, payload } = data;

  // Step 1: find all active webhooks subscribed to this event_type
  const webhookResult = await pool.query(
    `SELECT id FROM webhooks
     WHERE is_active = true
       AND $1 = ANY(event_types)`,
    [event_type]
  );

  if (webhookResult.rows.length === 0) {
    return []; // no subscribers, nothing to do
  }

  // Step 2: create one event row per matching webhook
  const createdEvents: WebhookEvent[] = [];

  for (const webhook of webhookResult.rows) {
    const result = await pool.query<WebhookEvent>(
      `INSERT INTO events (webhook_id, event_type, payload)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [webhook.id, event_type, JSON.stringify(payload)]
    );
    createdEvents.push(result.rows[0]);
  }

  return createdEvents;
}

export async function getEventsByWebhookId(webhookId: string): Promise<WebhookEvent[]> {
  const result = await pool.query<WebhookEvent>(
    `SELECT * FROM events
     WHERE webhook_id = $1
     ORDER BY created_at DESC`,
    [webhookId]
  );
  return result.rows;
}