import { FastifyInstance } from 'fastify';

export async function visualizationRoutes(fastify: FastifyInstance) {
  // TODO: Implement visualization routes
  fastify.get('/', async () => {
    return { message: 'Visualizations endpoint - not yet implemented' };
  });
}
