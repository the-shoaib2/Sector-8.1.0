export const rateLimitConfig = {
  global: false,
  max: 100,
  timeWindow: '1 minute',
  allowList: ['127.0.0.1', '::1'], // Localhost
  errorResponseBuilder: (request: any, context: any) => ({
    error: 'Rate Limit Exceeded',
    message: `Rate limit exceeded, retry in ${Math.ceil(context.ttl / 1000)} seconds`,
    retryAfter: Math.ceil(context.ttl / 1000),
    timestamp: new Date().toISOString()
  }),
  keyGenerator: (request: any) => {
    // Use user ID if authenticated, otherwise use IP
    return request.user?.id || request.ip;
  },
  skipOnError: false,
  enableDraftSpec: true,
  addHeadersOnExceeding: {
    'x-ratelimit-limit': true,
    'x-ratelimit-remaining': true,
    'x-ratelimit-reset': true
  },
  addHeaders: {
    'x-ratelimit-limit': true,
    'x-ratelimit-remaining': true,
    'x-ratelimit-reset': true,
    'retry-after': true
  }
};

// Specific rate limits for different endpoints
export const specificRateLimits = {
  auth: {
    max: 5,
    timeWindow: '15 minutes',
    errorMessage: 'Too many authentication attempts, please try again later'
  },
  prompts: {
    max: 10,
    timeWindow: '1 minute',
    errorMessage: 'Too many AI prompts, please slow down'
  },
  runs: {
    max: 3,
    timeWindow: '1 minute',
    errorMessage: 'Too many code executions, please wait'
  },
  uploads: {
    max: 5,
    timeWindow: '1 minute',
    errorMessage: 'Too many file uploads, please wait'
  },
  exports: {
    max: 2,
    timeWindow: '1 minute',
    errorMessage: 'Too many export requests, please wait'
  }
};
