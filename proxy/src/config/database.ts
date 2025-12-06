import { createClient } from '@supabase/supabase-js';
import { env } from './env.js';
import logger from '../utils/logger.js';

export const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_KEY);

// Test connection
export async function testDatabaseConnection(): Promise<boolean> {
  try {
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    if (error) throw error;
    logger.info('✅ Database connection successful');
    return true;
  } catch (error) {
    logger.error('❌ Database connection failed:', error);
    return false;
  }
}
