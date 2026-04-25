export interface Webhook {
  id: string;
  url: string;
  secret: string;
  event_types: string[];
  is_active: boolean;
  created_at: Date;
}

export interface CreateWebhookDTO {
  url: string;
  secret: string;
  event_types: string[];
}