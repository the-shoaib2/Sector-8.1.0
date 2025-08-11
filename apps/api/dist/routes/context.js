"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contextRoutes = contextRoutes;
async function contextRoutes(fastify) {
    // TODO: Implement context routes
    fastify.get('/', async () => {
        return { message: 'Context endpoint - not yet implemented' };
    });
}
//# sourceMappingURL=context.js.map