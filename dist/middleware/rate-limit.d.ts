export declare const rateLimitConfig: {
    global: boolean;
    max: number;
    timeWindow: string;
    allowList: string[];
    errorResponseBuilder: (request: any, context: any) => {
        error: string;
        message: string;
        retryAfter: number;
        timestamp: string;
    };
    keyGenerator: (request: any) => any;
    skipOnError: boolean;
    enableDraftSpec: boolean;
    addHeadersOnExceeding: {
        'x-ratelimit-limit': boolean;
        'x-ratelimit-remaining': boolean;
        'x-ratelimit-reset': boolean;
    };
    addHeaders: {
        'x-ratelimit-limit': boolean;
        'x-ratelimit-remaining': boolean;
        'x-ratelimit-reset': boolean;
        'retry-after': boolean;
    };
};
export declare const specificRateLimits: {
    auth: {
        max: number;
        timeWindow: string;
        errorMessage: string;
    };
    prompts: {
        max: number;
        timeWindow: string;
        errorMessage: string;
    };
    runs: {
        max: number;
        timeWindow: string;
        errorMessage: string;
    };
    uploads: {
        max: number;
        timeWindow: string;
        errorMessage: string;
    };
    exports: {
        max: number;
        timeWindow: string;
        errorMessage: string;
    };
};
//# sourceMappingURL=rate-limit.d.ts.map