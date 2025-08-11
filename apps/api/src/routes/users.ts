import { FastifyInstance } from 'fastify';

export async function userRoutes(fastify: FastifyInstance) {
  // TODO: Implement user routes
  fastify.get('/', async () => {
    return { message: 'Users endpoint - not yet implemented' };
  });
}
