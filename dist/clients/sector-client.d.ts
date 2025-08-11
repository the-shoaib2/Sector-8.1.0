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
    getRunStatus(runId: string): Promise<any>;
    sendPrompt(data: {
        message: string;
        context?: string;
        projectId?: string;
    }): Promise<any>;
    uploadDocument(file: File, projectId?: string): Promise<any>;
    analyzeContext(data: {
        query: string;
        documentIds: string[];
    }): Promise<any>;
    createVisualization(data: {
        type: string;
        data: any;
        projectId?: string;
    }): Promise<any>;
    exportVisualization(visualizationId: string, format: string): Promise<any>;
}
//# sourceMappingURL=sector-client.d.ts.map