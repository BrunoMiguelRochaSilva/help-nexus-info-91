import express from 'express';
import helmet from 'helmet';
import { env } from './config/env.js';
import { corsMiddleware } from './middleware/cors.js';
import { errorHandler } from './middleware/errorHandler.js';
import { testDatabaseConnection } from './config/database.js';
import { OllamaService } from './services/OllamaService.js';
import healthRouter from './routes/health.js';
import orphaRouter from './routes/orpha.js';
import chatRouter from './routes/chat.js';
import logger from './utils/logger.js';

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Allow SSE
  crossOriginEmbedderPolicy: false
}));

// CORS
app.use(corsMiddleware);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use(healthRouter);
app.use(orphaRouter);
app.use(chatRouter);

// Error handling
app.use(errorHandler);

// Startup checks
async function startServer() {
  try {
    logger.info('🚀 Starting Rare Help Proxy Server...');

    // Check database
    const dbOk = await testDatabaseConnection();
    if (!dbOk) {
      logger.warn('⚠️  Database connection failed, some features may not work');
    }

    // Check Ollama
    const ollamaService = new OllamaService();
    const ollamaOk = await ollamaService.healthCheck();
    if (!ollamaOk) {
      logger.error('❌ Ollama is not available. Please ensure Ollama is running.');
      process.exit(1);
    }

    logger.info('✅ Ollama is ready');

    // Start server
    app.listen(env.PORT, () => {
      logger.info(`✅ Server running on port ${env.PORT}`);
      logger.info(`📝 Environment: ${env.NODE_ENV}`);
      logger.info(`🤖 Ollama model: ${env.OLLAMA_MODEL}`);
      logger.info(`🌐 CORS origins: ${env.CORS_ORIGINS.join(', ')}`);
    });

  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
