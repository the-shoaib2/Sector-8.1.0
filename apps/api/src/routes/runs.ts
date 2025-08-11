import { FastifyInstance } from 'fastify';

export async function runRoutes(fastify: FastifyInstance) {
  // TODO: Implement run routes
  fastify.get('/', async () => {
    return { message: 'Runs endpoint - not yet implemented' };
  });
}
