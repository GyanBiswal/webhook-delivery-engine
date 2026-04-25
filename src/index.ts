import express, { Request, Response } from 'express';
import { config } from './config/env';
import webhookRoutes from './routes/webhook.routes';

const app = express();

app.use(express.json());

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/webhooks', webhookRoutes);

app.listen(config.port, () => {
  console.log(`🚀 Server running on port ${config.port}`);
});