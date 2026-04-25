import { Request, Response } from 'express';
import * as WebhookService from '../services/webhook.service';

export async function registerWebhook(req: Request, res: Response) {
  try {
    const { url, secret, event_types } = req.body;

    if (!url || !secret || !event_types?.length) {
      res.status(400).json({
        error: 'url, secret, and event_types are required',
      });
      return;
    }

    if (!Array.isArray(event_types)) {
      res.status(400).json({ error: 'event_types must be an array' });
      return;
    }

    const webhook = await WebhookService.createWebhook({ url, secret, event_types });

    res.status(201).json({ data: webhook });
  } catch (err) {
    console.error('registerWebhook error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getWebhooks(req: Request, res: Response) {
  try {
    const webhooks = await WebhookService.listWebhooks();
    res.json({ data: webhooks });
  } catch (err) {
    console.error('getWebhooks error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getWebhook(req: Request, res: Response) {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    if (!id) {
      res.status(400).json({ error: "Invalid webhook id" });
      return;
    }
    
    const webhook = await WebhookService.getWebhookById(id);

    if (!webhook) {
      res.status(404).json({ error: 'Webhook not found' });
      return;
    }

    res.json({ data: webhook });
  } catch (err) {
    console.error('getWebhook error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}