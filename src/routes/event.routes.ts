import { Router } from 'express';
import * as EventController from '../controllers/event.controller';

const router = Router();

router.post('/', EventController.triggerEvent);
router.get('/webhook/:webhookId', EventController.getWebhookEvents);

export default router;