import rateLimit from 'express-rate-limit';
import { supabase } from '../config/database.js';
import logger from '../utils/logger.js';

// Database-backed rate limiter
export async function checkRateLimit(identifier: string): Promise<boolean> {
  const windowMs = 60000; // 1 minute
  const maxRequests = 100;

  const { data, error } = await supabase
    .from('rate_limits')
    .select('*')
    .eq('identifier', identifier)
    .single();

  if (error && error.code !== 'PGRST116') {
    logger.error('Rate limit check failed:', error);
    return false;
  }

  const now = new Date();

  if (!data) {
    // First request from this identifier
    await supabase.from('rate_limits').insert({
      identifier,
      submission_count: 1,
      window_start: now,
      last_submission: now
    });
    return true;
  }

  const windowStart = new Date(data.window_start);
  const elapsed = now.getTime() - windowStart.getTime();

  if (elapsed > windowMs) {
    // Window expired, reset
    await supabase.from('rate_limits').update({
      submission_count: 1,
      window_start: now,
      last_submission: now
    }).eq('identifier', identifier);
    return true;
  }

  if (data.submission_count >= maxRequests) {
    logger.warn(`Rate limit exceeded for identifier: ${identifier}`);
    return false;
  }

  // Increment counter
  await supabase.from('rate_limits').update({
    submission_count: data.submission_count + 1,
    last_submission: now
  }).eq('identifier', identifier);

  return true;
}

// Express middleware for general rate limiting
export const rateLimitMiddleware = rateLimit({
  windowMs: 60000,
  max: 100,
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false
});
