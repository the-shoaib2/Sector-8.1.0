"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runRoutes = runRoutes;
async function runRoutes(fastify) {
    // TODO: Implement run routes
    fastify.get('/', async () => {
        return { message: 'Runs endpoint - not yet implemented' };
    });
}
//# sourceMappingURL=runs.js.map