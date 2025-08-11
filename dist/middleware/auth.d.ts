import { FastifyRequest, FastifyReply } from 'fastify';
export declare function authenticate(request: FastifyRequest, reply: FastifyReply): Promise<void>;
export declare function requireRole(roles: string[]): (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
export declare function requireOwner(): (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
//# sourceMappingURL=auth.d.ts.map