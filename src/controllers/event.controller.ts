import { Request, Response } from 'express';
import * as EventService from '../services/event.service';

export async function triggerEvent(req: Request, res: Response) {
  try {
    const { event_type, payload } = req.body;

    if (!event_type || !payload) {
      res.status(400).json({ error: 'event_type and payload are required' });
      return;
    }

    if (typeof payload !== 'object' || Array.isArray(payload)) {
      res.status(400).json({ error: 'payload must be a JSON object' });
      return;
    }

    const events = await EventService.createEvents({ event_type, payload });

    if (events.length === 0) {
      res.status(200).json({
        message: 'No active webhooks found for this event type',
        data: [],
      });
      return;
    }

    res.status(201).json({
      message: `Event queued for ${events.length} webhook(s)`,
      data: events,
    });
  } catch (err) {
    console.error('triggerEvent error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getWebhookEvents(req: Request, res: Response) {
  try {
    const { webhookId } = req.params;

    if (!webhookId || Array.isArray(webhookId)) {
      return res.status(400).json({ error: "Invalid webhookId" });
    }

    const events = await EventService.getEventsByWebhookId(webhookId);
    res.json({ data: events });
  } catch (err) {
    console.error("getWebhookEvents error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}