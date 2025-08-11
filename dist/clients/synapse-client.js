"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SynapseClient = void 0;
class SynapseClient {
    baseUrl;
    token = null;
    constructor() {
        this.baseUrl = process.env.SYNAPSE_API_URL || 'http://localhost:3001';
    }
    setToken(token) {
        this.token = token;
    }
    clearToken() {
        this.token = null;
    }
    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        try {
            const response = await fetch(url, {
                ...options,
                headers
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        }
        catch (error) {
            console.error('Synapse API request failed:', error);
            throw error;
        }
    }
    async healthCheck() {
        return this.request('/health');
    }
    async login(email, password) {
        const response = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        this.setToken(response.token);
        return response;
    }
    async logout() {
        try {
            await this.request('/auth/logout', { method: 'POST' });
        }
        finally {
            this.clearToken();
        }
    }
    async getCurrentUser() {
        return this.request('/auth/me');
    }
    async getProjects() {
        return this.request('/projects');
    }
    async getProject(id) {
        return this.request(`/projects/${id}`);
    }
    async createProject(data) {
        return this.request('/projects', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }
    async updateProject(id, data) {
        return this.request(`/projects/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }
    async deleteProject(id) {
        await this.request(`/projects/${id}`, { method: 'DELETE' });
    }
    async executeCode(projectId, data) {
        return this.request('/runs', {
            method: 'POST',
            body: JSON.stringify({
                projectId,
                ...data
            })
        });
    }
    async getRun(id) {
        return this.request(`/runs/${id}`);
    }
    async getRunLogs(id) {
        return this.request(`/runs/${id}/logs`);
    }
    async stopRun(id) {
        await this.request(`/runs/${id}/stop`, { method: 'POST' });
    }
    async uploadFile(projectId, file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('projectId', projectId);
        return this.request('/files/upload', {
            method: 'POST',
            body: formData
        });
    }
    async getFiles(projectId) {
        return this.request(`/projects/${projectId}/files`);
    }
    async deleteFile(fileId) {
        await this.request(`/files/${fileId}`, { method: 'DELETE' });
    }
    async analyzeCode(projectId, data) {
        return this.request('/ai/analyze', {
            method: 'POST',
            body: JSON.stringify({
                projectId,
                ...data
            })
        });
    }
    async generateCode(projectId, data) {
        return this.request('/ai/generate', {
            method: 'POST',
            body: JSON.stringify({
                projectId,
                ...data
            })
        });
    }
    async explainCode(projectId, data) {
        return this.request('/ai/explain', {
            method: 'POST',
            body: JSON.stringify({
                projectId,
                ...data
            })
        });
    }
    async createVisualization(projectId, data) {
        return this.request('/visualizations', {
            method: 'POST',
            body: JSON.stringify({
                projectId,
                ...data
            })
        });
    }
    async getVisualizations(projectId) {
        return this.request(`/projects/${projectId}/visualizations`);
    }
    async exportVisualization(id, format) {
        return this.request(`/visualizations/${id}/export`, {
            method: 'POST',
            body: JSON.stringify({ format })
        });
    }
    async searchDocuments(query, filters) {
        const params = new URLSearchParams({ q: query });
        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                params.append(key, value);
            });
        }
        return this.request(`/documents/search?${params.toString()}`);
    }
    async getDocument(id) {
        return this.request(`/documents/${id}`);
    }
    async uploadDocument(file, metadata) {
        const formData = new FormData();
        formData.append('file', file);
        if (metadata) {
            formData.append('metadata', JSON.stringify(metadata));
        }
        return this.request('/documents/upload', {
            method: 'POST',
            body: formData
        });
    }
    async getContextSession(id) {
        return this.request(`/context-sessions/${id}`);
    }
    async createContextSession(data) {
        return this.request('/context-sessions', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }
    async queryContext(sessionId, query) {
        return this.request(`/context-sessions/${sessionId}/query`, {
            method: 'POST',
            body: JSON.stringify({ query })
        });
    }
}
exports.SynapseClient = SynapseClient;
