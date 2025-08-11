"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = requestLogger;
async function requestLogger(request, reply) {
    // Log request start
    request.log.info({
        type: 'request_start',
        method: request.method,
        url: request.url,
        ip: request.ip,
        userAgent: request.headers['user-agent']
    });
}
//# sourceMappingURL=logger.js.map