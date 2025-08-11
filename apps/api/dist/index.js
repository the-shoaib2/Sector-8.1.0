"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const helmet_1 = __importDefault(require("@fastify/helmet"));
const rate_limit_1 = __importDefault(require("@fastify/rate-limit"));
const websocket_1 = __importDefault(require("@fastify/websocket"));
const jwt_1 = __importDefault(require("@fastify/jwt"));
const multipart_1 = __importDefault(require("@fastify/multipart"));
const static_1 = __importDefault(require("@fastify/static"));
const path_1 = require("path");
// Import routes
const health_1 = require("./routes/health");
const auth_1 = require("./routes/auth");
const users_1 = require("./routes/users");
const projects_1 = require("./routes/projects");
const runs_1 = require("./routes/runs");
const prompts_1 = require("./routes/prompts");
const documents_1 = require("./routes/documents");
const context_1 = require("./routes/context");
const visualizations_1 = require("./routes/visualizations");
const exports_1 = require("./routes/exports");
// Import middleware
const error_1 = require("./middleware/error");
const logger_1 = require("./middleware/logger");
const rate_limit_2 = require("./middleware/rate-limit");
// Create Fastify instance
const fastify = (0, fastify_1.default)({
    logger: {
        level: process.env.LOG_LEVEL || 'info'
    }
});
// Register plugins
async function registerPlugins() {
    // Security plugins
    await fastify.register(helmet_1.default);
    await fastify.register(cors_1.default, {
        origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
        credentials: true
    });
    // Rate limiting
    await fastify.register(rate_limit_1.default, rate_limit_2.rateLimitConfig);
    // JWT authentication
    await fastify.register(jwt_1.default, {
        secret: process.env.JWT_SECRET || 'your-secret-key'
    });
    // WebSocket support
    await fastify.register(websocket_1.default);
    // File upload support
    await fastify.register(multipart_1.default, {
        limits: {
            fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB
            files: parseInt(process.env.MAX_FILES || '5')
        }
    });
    // Static file serving
    await fastify.register(static_1.default, {
        root: (0, path_1.join)(__dirname, '../public'),
        prefix: '/public/'
    });
}
// Register routes
async function registerRoutes() {
    // Health check routes
    await fastify.register(health_1.healthRoutes, { prefix: '/health' });
    // API routes
    await fastify.register(auth_1.authRoutes, { prefix: '/auth' });
    await fastify.register(users_1.userRoutes, { prefix: '/users' });
    await fastify.register(projects_1.projectRoutes, { prefix: '/projects' });
    await fastify.register(runs_1.runRoutes, { prefix: '/runs' });
    await fastify.register(prompts_1.promptRoutes, { prefix: '/prompts' });
    await fastify.register(documents_1.documentRoutes, { prefix: '/documents' });
    await fastify.register(context_1.contextRoutes, { prefix: '/context' });
    await fastify.register(visualizations_1.visualizationRoutes, { prefix: '/visualizations' });
    await fastify.register(exports_1.exportRoutes, { prefix: '/exports' });
}
// Global error handler
fastify.setErrorHandler(error_1.errorHandler);
// Request logging hook
fastify.addHook('onRequest', logger_1.requestLogger);
// Authentication hook for protected routes
fastify.addHook('onRequest', async (request, reply) => {
    // Skip authentication for public routes
    const publicRoutes = ['/health', '/auth/login', '/auth/register'];
    if (publicRoutes.includes(request.url)) {
        return;
    }
    // TODO: Implement proper authentication
    // For now, just log the request
    request.log.info('Request to protected route: %s', request.url);
});
// Graceful shutdown
async function gracefulShutdown() {
    console.log('\n🔄 Shutting down gracefully...');
    try {
        await fastify.close();
        console.log('✅ Graceful shutdown completed');
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Error during shutdown:', error);
        process.exit(1);
    }
}
// Handle shutdown signals
process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
// Start server
async function start() {
    try {
        // Register plugins and routes
        await registerPlugins();
        await registerRoutes();
        // Start server
        const port = parseInt(process.env.PORT || '3001');
        const host = process.env.HOST || '0.0.0.0';
        await fastify.listen({ port, host });
        console.log(`🚀 Server running on http://${host}:${port}`);
        console.log(`📊 Health check: http://${host}:${port}/health`);
    }
    catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}
// Start the server if this file is executed directly
if (require.main === module) {
    start();
}
//# sourceMappingURL=index.js.map