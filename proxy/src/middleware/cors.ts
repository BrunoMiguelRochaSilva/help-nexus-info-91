import cors from 'cors';
import { env } from '../config/env.js';

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      callback(null, true);
      return;
    }

    // Allow all localhost origins in development
    if (env.NODE_ENV === 'development' && origin.startsWith('http://localhost')) {
      callback(null, true);
      return;
    }

    // Check configured CORS origins
    if (env.CORS_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
});
