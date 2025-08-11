import { FastifyInstance } from 'fastify';

export async function contextRoutes(fastify: FastifyInstance) {
  // TODO: Implement context routes
  fastify.get('/', async () => {
    return { message: 'Context endpoint - not yet implemented' };
  });
}
