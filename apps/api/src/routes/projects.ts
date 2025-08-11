import { FastifyInstance } from 'fastify';

export async function projectRoutes(fastify: FastifyInstance) {
  // TODO: Implement project routes
  fastify.get('/', async () => {
    return { message: 'Projects endpoint - not yet implemented' };
  });
}
