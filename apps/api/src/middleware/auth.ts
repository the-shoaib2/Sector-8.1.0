import { FastifyRequest, FastifyReply } from 'fastify';

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  try {
    const token = request.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      reply.code(401).send({
        error: 'Authentication required',
        message: 'No authorization token provided'
      });
      return;
    }

    // Verify JWT token
    const decoded = await request.jwtVerify();
    (request as any).user = decoded;
    
  } catch (error) {
    reply.code(401).send({
      error: 'Authentication failed',
      message: 'Invalid or expired token'
    });
  }
}

export function requireRole(roles: string[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const user = (request as any).user;
    if (!user) {
      reply.code(401).send({
        error: 'Authentication required',
        message: 'User not authenticated'
      });
      return;
    }

    if (!roles.includes(user.role)) {
      reply.code(403).send({
        error: 'Insufficient permissions',
        message: `Required roles: ${roles.join(', ')}. User role: ${user.role}`
      });
      return;
    }
  };
}

export function requireOwner() {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const user = (request as any).user;
    if (!user) {
      reply.code(401).send({
        error: 'Authentication required',
        message: 'User not authenticated'
      });
      return;
    }

    // This middleware assumes the resource has an ownerId field
    // It should be used in combination with other middleware that sets the resource
    const resource = (request as any).resource;
    if (!resource) {
      reply.code(500).send({
        error: 'Internal server error',
        message: 'Resource not found in request context'
      });
      return;
    }

    if (resource.ownerId !== user.id && user.role !== 'admin') {
      reply.code(403).send({
        error: 'Access denied',
        message: 'You do not have permission to access this resource'
      });
      return;
    }
  };
}
