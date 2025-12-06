import { Router, Request, Response } from 'express';
import { orphaService } from '../services/index.js';
import { rateLimitMiddleware } from '../middleware/rateLimit.js';
import logger from '../utils/logger.js';

const router = Router();

router.get('/api/orpha/:term', rateLimitMiddleware, async (req: Request, res: Response) => {
  const { term } = req.params;

  if (!term || term.length < 2) {
    return res.status(400).json({ error: 'Search term must be at least 2 characters' });
  }

  try {
    const disease = await orphaService.searchDisease(term);

    if (!disease) {
      return res.status(404).json({
        error: 'Disease not found',
        suggestion: 'Try using the AI chat for more information'
      });
    }

    res.json(disease);
  } catch (error) {
    logger.error('Orpha route error:', error);
    res.status(500).json({ error: 'Failed to search Orphadata' });
  }
});

export default router;
