import { FastifyInstance } from 'fastify';

export async function documentRoutes(fastify: FastifyInstance) {
  // TODO: Implement document routes
  fastify.get('/', async () => {
    return { message: 'Documents endpoint - not yet implemented' };
  });
}
