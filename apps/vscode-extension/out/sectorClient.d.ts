import * as vscode from 'vscode';
export interface SectorProject {
    id: string;
    name: string;
    description?: string;
    visibility: 'private' | 'shared' | 'public';
    tags: string[];
    createdAt: string;
    updatedAt: string;
    lastRunAt?: string;
}
export interface SectorRun {
    id: string;
    projectId: string;
    name: string;
    status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled' | 'timeout';
    language: string;
    startedAt?: string;
    completedAt?: string;
    duration?: number;
    exitCode?: number;
    error?: string;
    output?: string;
}
export interface SectorPrompt {
    id: string;
    prompt: string;
    response?: string;
    status: 'pending' | 'streaming' | 'completed' | 'failed' | 'cancelled';
    createdAt: string;
}
export interface SectorDocument {
    id: string;
    name: string;
    type: 'pdf' | 'book' | 'markdown' | 'text' | 'code';
    size: number;
    isProcessed: boolean;
    createdAt: string;
}
export interface SectorVisualization {
    id: string;
    name: string;
    type: string;
    description?: string;
    createdAt: string;
}
export declare class SectorClient {
    private context;
    private apiClient;
    private authStatusCallbacks;
    private isAuthenticated;
    constructor(context: vscode.ExtensionContext);
    login(): Promise<boolean>;
    logout(): Promise<void>;
    checkAuthStatus(): Promise<boolean>;
    private getAuthToken;
    private handleAuthError;
    onAuthStatusChanged(callback: (isAuthenticated: boolean) => void): void;
    private notifyAuthStatusChange;
    getProjects(): Promise<SectorProject[]>;
    createProject(name: string, description?: string, visibility?: 'private' | 'shared' | 'public'): Promise<SectorProject>;
    getProject(projectId: string): Promise<SectorProject>;
    updateProject(projectId: string, updates: Partial<SectorProject>): Promise<SectorProject>;
    deleteProject(projectId: string): Promise<void>;
    getProjectRuns(projectId: string): Promise<SectorRun[]>;
    createRun(projectId: string, runData: {
        name: string;
        language: string;
        entryPoint: string;
    }): Promise<SectorRun>;
    getRun(runId: string): Promise<SectorRun>;
    submitPrompt(prompt: string, projectId?: string, context?: any): Promise<SectorPrompt>;
    getDocuments(): Promise<SectorDocument[]>;
    uploadDocument(filePath: string, name: string, type: string): Promise<SectorDocument>;
    getVisualizations(projectId?: string): Promise<SectorVisualization[]>;
    createVisualization(visualizationData: {
        name: string;
        type: string;
        data: any;
        projectId?: string;
    }): Promise<SectorVisualization>;
    healthCheck(): Promise<boolean>;
}
//# sourceMappingURL=sectorClient.d.ts.map