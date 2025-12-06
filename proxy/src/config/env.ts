import { z } from 'zod';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from project root first, then override with proxy/ local .env
dotenv.config({ path: join(__dirname, '../../../.env') });
dotenv.config({ path: join(__dirname, '../../.env'), override: true });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3001').transform(Number),
  OLLAMA_API_URL: z.string().url(),
  OLLAMA_MODEL: z.string().default('gemma:2b'),
  OLLAMA_TEMPERATURE: z.string().default('0.7').transform(val => {
    const num = Number(val);
    if (num < 0 || num > 1) throw new Error('OLLAMA_TEMPERATURE must be between 0 and 1');
    return num;
  }),
  OLLAMA_MAX_TOKENS: z.string().default('2048').transform(val => {
    const num = Number(val);
    if (num < 1) throw new Error('OLLAMA_MAX_TOKENS must be at least 1');
    return num;
  }),
  OLLAMA_TOP_P: z.string().default('0.9').transform(val => {
    const num = Number(val);
    if (num < 0 || num > 1) throw new Error('OLLAMA_TOP_P must be between 0 and 1');
    return num;
  }),
  OLLAMA_TOP_K: z.string().default('10').transform(val => {
    const num = Number(val);
    if (num < 1) throw new Error('OLLAMA_TOP_K must be at least 1');
    return num;
  }),
  OLLAMA_REPEAT_PENALTY: z.string().default('1.1').transform(val => {
    const num = Number(val);
    if (num < 0) throw new Error('OLLAMA_REPEAT_PENALTY must be at least 0');
    return num;
  }),
  SUPABASE_URL: z.string().url(),
  SUPABASE_KEY: z.string().min(1),
  ORPHADATA_API_URL: z.string().url(),
  CORS_ORIGINS: z.string().transform(s => s.split(',')),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info')
});

export const env = envSchema.parse(process.env);
export type Env = z.infer<typeof envSchema>;
