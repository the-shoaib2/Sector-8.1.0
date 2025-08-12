declare class AuthServer {
    private server;
    private port;
    private users;
    private tokens;
    constructor(port?: number);
    start(): void;
    private handleRequest;
    private serveHomePage;
    private serveLoginPage;
    private serveSignupPage;
    private handleLogin;
    private handleSignup;
    private handleOAuth;
    private handleRedirect;
    private getRequestBody;
    private sendJsonResponse;
    private methodNotAllowed;
    private notFound;
    private generateToken;
}
export { AuthServer };
//# sourceMappingURL=server.d.ts.map