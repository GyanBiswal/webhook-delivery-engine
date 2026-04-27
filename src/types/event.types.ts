export interface WebhookEvent {
  id: string;
  webhook_id: string;
  event_type: string;
  payload: Record<string, unknown>;
  status: 'pending' | 'delivered' | 'failed';
  created_at: Date;
}

export interface CreateEventDTO {
  event_type: string;
  payload: Record<string, unknown>;
}