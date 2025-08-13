export declare class SectorClient {
    private baseUrl;
    private token;
    constructor();
    setToken(token: string): void;
    clearToken(): void;
    private request;
    healthCheck(): Promise<{
        status: string;
    }>;
    login(email: string, password: string): Promise<{
        token: string;
        user: any;
    }>;
    loginWithOAuth(provider: 'google' | 'github'): Promise<string>;
    logout(): Promise<void>;
    getCurrentUser(): Promise<any>;
    getProjects(): Promise<any[]>;
    getProject(id: string): Promise<any>;
    createProject(data: {
        name: string;
        description?: string;
        visibility?: string;
    }): Promise<any>;
    updateProject(id: string, data: Partial<any>): Promise<any>;
    deleteProject(id: string): Promise<void>;
    executeCode(projectId: string, data: {
        language: string;
        entryPoint: string;
        args?: string[];
    }): Promise<any>;
    sendPrompt(projectId: string, prompt: string, context?: any): Promise<any>;
    getRuns(projectId?: string): Promise<any[]>;
    getRun(id: string): Promise<any>;
    createVisualization(projectId: string, data: {
        type: string;
        config: any;
    }): Promise<any>;
    getVisualizations(projectId?: string): Promise<any[]>;
    exportVisualization(id: string, format: 'png' | 'svg' | 'pdf'): Promise<Blob>;
    isAuthenticated(): boolean;
    getToken(): string | null;
}
//# sourceMappingURL=synapse-client.d.ts.map