import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

export async function healthRoutes(fastify: FastifyInstance) {
  // Health check endpoint
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const health = {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: process.env.npm_package_version || '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        services: {
          database: 'not implemented',
          api: 'healthy'
        }
      };

      reply.code(200).send(health);
    } catch (error) {
      reply.code(503).send({
        status: 'error',
        timestamp: new Date().toISOString(),
        error: 'Health check failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Detailed health check
  fastify.get('/detailed', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const startTime = Date.now();
      const responseTime = Date.now() - startTime;

      const detailedHealth = {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: process.env.npm_package_version || '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        responseTime: `${responseTime}ms`,
        services: {
          database: {
            status: 'not implemented',
            responseTime: '0ms'
          },
          api: {
            status: 'healthy',
            responseTime: '0ms'
          }
        },
        system: {
          memory: process.memoryUsage(),
          platform: process.platform,
          nodeVersion: process.version,
          pid: process.pid
        }
      };

      reply.code(200).send(detailedHealth);
    } catch (error) {
      reply.code(503).send({
        status: 'error',
        timestamp: new Date().toISOString(),
        error: 'Detailed health check failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Readiness probe for Kubernetes
  fastify.get('/ready', async (request: FastifyRequest, reply: FastifyReply) => {
    reply.code(200).send({
      status: 'ready',
      timestamp: new Date().toISOString()
    });
  });

  // Liveness probe for Kubernetes
  fastify.get('/live', async (request: FastifyRequest, reply: FastifyReply) => {
    reply.code(200).send({
      status: 'alive',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  });
}
