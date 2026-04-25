import { Router } from 'express';
import * as WebhookController from '../controllers/webhook.controller';

const router = Router();

router.post('/', WebhookController.registerWebhook);
router.get('/', WebhookController.getWebhooks);
router.get('/:id', WebhookController.getWebhook);

export default router;