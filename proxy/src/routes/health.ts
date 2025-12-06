import { Router, Request, Response } from 'express';
import { OllamaService } from '../services/OllamaService.js';
import { testDatabaseConnection } from '../config/database.js';

const router = Router();
const ollamaService = new OllamaService();

router.get('/status', async (req: Request, res: Response) => {
  const ollamaHealthy = await ollamaService.healthCheck();
  const dbHealthy = await testDatabaseConnection();

  const status = {
    status: ollamaHealthy && dbHealthy ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    services: {
      ollama: ollamaHealthy ? 'up' : 'down',
      database: dbHealthy ? 'up' : 'down'
    }
  };

  res.status(ollamaHealthy && dbHealthy ? 200 : 503).json(status);
});

export default router;
