import { FastifyError, FastifyRequest, FastifyReply } from 'fastify';

export function errorHandler(error: FastifyError, request: FastifyRequest, reply: FastifyReply) {
  // Log the error
  request.log.error(error);

  // Handle validation errors
  if (error.validation) {
    reply.code(400).send({
      error: 'Validation Error',
      message: 'Request validation failed',
      details: error.validation,
      timestamp: new Date().toISOString()
    });
    return;
  }

  // Handle JWT errors
  if (error.name === 'JsonWebTokenError') {
    reply.code(401).send({
      error: 'Authentication Error',
      message: 'Invalid token',
      timestamp: new Date().toISOString()
    });
    return;
  }

  if (error.name === 'TokenExpiredError') {
    reply.code(401).send({
      error: 'Authentication Error',
      message: 'Token expired',
      timestamp: new Date().toISOString()
    });
    return;
  }

  // Handle rate limiting errors
  if (error.statusCode === 429) {
    reply.code(429).send({
      error: 'Rate Limit Exceeded',
      message: 'Too many requests, please try again later',
      timestamp: new Date().toISOString()
    });
    return;
  }

  // Handle database errors
  if (error.code === '23505') { // Unique constraint violation
    reply.code(409).send({
      error: 'Conflict',
      message: 'Resource already exists',
      timestamp: new Date().toISOString()
    });
    return;
  }

  if (error.code === '23503') { // Foreign key constraint violation
    reply.code(400).send({
      error: 'Bad Request',
      message: 'Referenced resource does not exist',
      timestamp: new Date().toISOString()
    });
    return;
  }

  // Handle file upload errors
  if (error.code === 'LIMIT_FILE_SIZE') {
    reply.code(413).send({
      error: 'File Too Large',
      message: 'Uploaded file exceeds maximum size limit',
      timestamp: new Date().toISOString()
    });
    return;
  }

  if (error.code === 'LIMIT_FILE_COUNT') {
    reply.code(413).send({
      error: 'Too Many Files',
      message: 'Too many files uploaded at once',
      timestamp: new Date().toISOString()
    });
    return;
  }

  // Handle generic errors
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  // In production, don't expose internal error details
  const isProduction = process.env.NODE_ENV === 'production';
  
  reply.code(statusCode).send({
    error: 'Server Error',
    message: isProduction ? 'An unexpected error occurred' : message,
    ...(isProduction ? {} : { stack: error.stack }),
    timestamp: new Date().toISOString()
  });
}
