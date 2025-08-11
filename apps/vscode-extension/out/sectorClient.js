"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SectorClient = void 0;
const vscode = __importStar(require("vscode"));
const axios_1 = __importDefault(require("axios"));
class SectorClient {
    constructor(context) {
        this.context = context;
        this.authStatusCallbacks = [];
        this.isAuthenticated = false;
        const config = vscode.workspace.getConfiguration('sector');
        const apiUrl = config.get('apiUrl') || 'http://localhost:3001';
        this.apiClient = axios_1.default.create({
            baseURL: apiUrl,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        // Add request interceptor to include auth token
        this.apiClient.interceptors.request.use((config) => {
            const token = this.getAuthToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        }, (error) => {
            return Promise.reject(error);
        });
        // Add response interceptor to handle auth errors
        this.apiClient.interceptors.response.use((response) => response, (error) => {
            if (error.response?.status === 401) {
                this.handleAuthError();
            }
            return Promise.reject(error);
        });
    }
    // Authentication methods
    async login() {
        try {
            // For now, we'll use a simple token input
            // In production, this would open a web browser for OAuth
            const token = await vscode.window.showInputBox({
                prompt: 'Enter your Sector API token',
                password: true,
                placeHolder: 'Bearer token...'
            });
            if (!token) {
                return false;
            }
            // Store the token
            await this.context.secrets.store('sector-auth-token', token);
            this.isAuthenticated = true;
            this.notifyAuthStatusChange(true);
            vscode.window.showInformationMessage('✅ Successfully logged in to Sector');
            return true;
        }
        catch (error) {
            vscode.window.showErrorMessage(`❌ Login failed: ${error}`);
            return false;
        }
    }
    async logout() {
        await this.context.secrets.delete('sector-auth-token');
        this.isAuthenticated = false;
        this.notifyAuthStatusChange(false);
        vscode.window.showInformationMessage('👋 Logged out from Sector');
    }
    async checkAuthStatus() {
        try {
            const token = this.getAuthToken();
            if (!token) {
                this.isAuthenticated = false;
                return false;
            }
            // Test the token by making a simple API call
            const response = await this.apiClient.get('/me');
            this.isAuthenticated = response.status === 200;
            this.notifyAuthStatusChange(this.isAuthenticated);
            return this.isAuthenticated;
        }
        catch (error) {
            this.isAuthenticated = false;
            this.notifyAuthStatusChange(false);
            return false;
        }
    }
    async getAuthToken() {
        return await this.context.secrets.get('sector-auth-token');
    }
    handleAuthError() {
        this.isAuthenticated = false;
        this.notifyAuthStatusChange(false);
        vscode.window.showErrorMessage('❌ Authentication failed. Please login again.');
    }
    onAuthStatusChanged(callback) {
        this.authStatusCallbacks.push(callback);
    }
    notifyAuthStatusChange(isAuthenticated) {
        this.authStatusCallbacks.forEach(callback => callback(isAuthenticated));
    }
    // API methods
    async getProjects() {
        try {
            const response = await this.apiClient.get('/projects');
            return response.data;
        }
        catch (error) {
            throw new Error(`Failed to fetch projects: ${error}`);
        }
    }
    async createProject(name, description, visibility = 'private') {
        try {
            const response = await this.apiClient.post('/projects', {
                name,
                description,
                visibility
            });
            return response.data;
        }
        catch (error) {
            throw new Error(`Failed to create project: ${error}`);
        }
    }
    async getProject(projectId) {
        try {
            const response = await this.apiClient.get(`/projects/${projectId}`);
            return response.data;
        }
        catch (error) {
            throw new Error(`Failed to fetch project: ${error}`);
        }
    }
    async updateProject(projectId, updates) {
        try {
            const response = await this.apiClient.patch(`/projects/${projectId}`, updates);
            return response.data;
        }
        catch (error) {
            throw new Error(`Failed to update project: ${error}`);
        }
    }
    async deleteProject(projectId) {
        try {
            await this.apiClient.delete(`/projects/${projectId}`);
        }
        catch (error) {
            throw new Error(`Failed to delete project: ${error}`);
        }
    }
    async getProjectRuns(projectId) {
        try {
            const response = await this.apiClient.get(`/projects/${projectId}/runs`);
            return response.data;
        }
        catch (error) {
            throw new Error(`Failed to fetch project runs: ${error}`);
        }
    }
    async createRun(projectId, runData) {
        try {
            const response = await this.apiClient.post(`/projects/${projectId}/runs`, runData);
            return response.data;
        }
        catch (error) {
            throw new Error(`Failed to create run: ${error}`);
        }
    }
    async getRun(runId) {
        try {
            const response = await this.apiClient.get(`/runs/${runId}`);
            return response.data;
        }
        catch (error) {
            throw new Error(`Failed to fetch run: ${error}`);
        }
    }
    async submitPrompt(prompt, projectId, context) {
        try {
            const response = await this.apiClient.post('/prompts', {
                prompt,
                projectId,
                context
            });
            return response.data;
        }
        catch (error) {
            throw new Error(`Failed to submit prompt: ${error}`);
        }
    }
    async getDocuments() {
        try {
            const response = await this.apiClient.get('/documents');
            return response.data;
        }
        catch (error) {
            throw new Error(`Failed to fetch documents: ${error}`);
        }
    }
    async uploadDocument(filePath, name, type) {
        try {
            // This would need to be implemented with proper file upload handling
            throw new Error('Document upload not yet implemented');
        }
        catch (error) {
            throw new Error(`Failed to upload document: ${error}`);
        }
    }
    async getVisualizations(projectId) {
        try {
            const url = projectId ? `/visualizations?projectId=${projectId}` : '/visualizations';
            const response = await this.apiClient.get(url);
            return response.data;
        }
        catch (error) {
            throw new Error(`Failed to fetch visualizations: ${error}`);
        }
    }
    async createVisualization(visualizationData) {
        try {
            const response = await this.apiClient.post('/visualizations', visualizationData);
            return response.data;
        }
        catch (error) {
            throw new Error(`Failed to create visualization: ${error}`);
        }
    }
    // Health check
    async healthCheck() {
        try {
            const response = await this.apiClient.get('/health');
            return response.status === 200;
        }
        catch (error) {
            return false;
        }
    }
}
exports.SectorClient = SectorClient;
//# sourceMappingURL=sectorClient.js.map