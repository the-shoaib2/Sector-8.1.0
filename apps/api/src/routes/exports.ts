import { FastifyInstance } from 'fastify';

export async function exportRoutes(fastify: FastifyInstance) {
  // TODO: Implement export routes
  fastify.get('/', async () => {
    return { message: 'Exports endpoint - not yet implemented' };
  });
}
