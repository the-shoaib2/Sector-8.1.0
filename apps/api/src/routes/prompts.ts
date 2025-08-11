import { FastifyInstance } from 'fastify';

export async function promptRoutes(fastify: FastifyInstance) {
  // TODO: Implement prompt routes
  fastify.get('/', async () => {
    return { message: 'Prompts endpoint - not yet implemented' };
  });
}
