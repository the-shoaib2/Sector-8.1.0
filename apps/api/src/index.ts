import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import websocket from '@fastify/websocket';
import jwt from '@fastify/jwt';
import multipart from '@fastify/multipart';
import staticFiles from '@fastify/static';
import { join } from 'path';

// Import routes
import { healthRoutes } from './routes/health';
import { authRoutes } from './routes/auth';
import { userRoutes } from './routes/users';
import { projectRoutes } from './routes/projects';
import { runRoutes } from './routes/runs';
import { promptRoutes } from './routes/prompts';
import { documentRoutes } from './routes/documents';
import { contextRoutes } from './routes/context';
import { visualizationRoutes } from './routes/visualizations';
import { exportRoutes } from './routes/exports';

// Import middleware
import { errorHandler } from './middleware/error';
import { requestLogger } from './middleware/logger';
import { rateLimitConfig } from './middleware/rate-limit';

// Create Fastify instance
const fastify: FastifyInstance = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info'
  }
});

// Register plugins
async function registerPlugins() {
  // Security plugins
  await fastify.register(helmet);
  await fastify.register(cors, {
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
    credentials: true
  });

  // Rate limiting
  await fastify.register(rateLimit, rateLimitConfig);

  // JWT authentication
  await fastify.register(jwt, {
    secret: process.env.JWT_SECRET || 'your-secret-key'
  });

  // WebSocket support
  await fastify.register(websocket);

  // File upload support
  await fastify.register(multipart, {
    limits: {
      fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB
      files: parseInt(process.env.MAX_FILES || '5')
    }
  });

  // Static file serving
  await fastify.register(staticFiles, {
    root: join(__dirname, '../public'),
    prefix: '/public/'
  });
}

// Register routes
async function registerRoutes() {
  // Health check routes
  await fastify.register(healthRoutes, { prefix: '/health' });

  // API routes
  await fastify.register(authRoutes, { prefix: '/auth' });
  await fastify.register(userRoutes, { prefix: '/users' });
  await fastify.register(projectRoutes, { prefix: '/projects' });
  await fastify.register(runRoutes, { prefix: '/runs' });
  await fastify.register(promptRoutes, { prefix: '/prompts' });
  await fastify.register(documentRoutes, { prefix: '/documents' });
  await fastify.register(contextRoutes, { prefix: '/context' });
  await fastify.register(visualizationRoutes, { prefix: '/visualizations' });
  await fastify.register(exportRoutes, { prefix: '/exports' });
}

// Global error handler
fastify.setErrorHandler(errorHandler);

// Request logging hook
fastify.addHook('onRequest', requestLogger);

// Authentication hook for protected routes
fastify.addHook('onRequest', async (request, reply) => {
  // Skip authentication for public routes
  const publicRoutes = ['/health', '/auth/login', '/auth/register'];
  if (publicRoutes.includes(request.url)) {
    return;
  }

  // TODO: Implement proper authentication
  // For now, just log the request
  request.log.info('Request to protected route: %s', request.url);
});

// Graceful shutdown
async function gracefulShutdown() {
  console.log('\n🔄 Shutting down gracefully...');
  
  try {
    await fastify.close();
    console.log('✅ Graceful shutdown completed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
}

// Handle shutdown signals
process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

// Start server
async function start() {
  try {
    // Register plugins and routes
    await registerPlugins();
    await registerRoutes();
    
    // Start server
    const port = parseInt(process.env.PORT || '3001');
    const host = process.env.HOST || '0.0.0.0';
    
    await fastify.listen({ port, host });
    
    console.log(`🚀 Server running on http://${host}:${port}`);
    console.log(`📊 Health check: http://${host}:${port}/health`);
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server if this file is executed directly
if (require.main === module) {
  start();
}

