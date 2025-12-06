import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

const chatRequestSchema = z.object({
  message: z.string().min(1).max(5000),
  history: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string()
  })).optional(),
  userId: z.string().uuid().optional(),
  anonymousId: z.string().optional()
});

export function validateChatRequest(req: Request, res: Response, next: NextFunction) {
  try {
    req.body = chatRequestSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Invalid request',
        details: error.issues
      });
    } else {
      next(error);
    }
  }
}
