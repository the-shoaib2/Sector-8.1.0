"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SectorClient = void 0;
class SectorClient {
    baseUrl;
    token = null;
    constructor() {
        this.baseUrl = process.env.SECTOR_API_URL || 'http://localhost:3001';
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
            console.error('Sector API request failed:', error);
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
            body: JSON.stringify({ projectId, ...data })
        });
    }
    async getRunStatus(runId) {
        return this.request(`/runs/${runId}`);
    }
    async sendPrompt(data) {
        return this.request('/prompts', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }
    async uploadDocument(file, projectId) {
        const formData = new FormData();
        formData.append('file', file);
        if (projectId) {
            formData.append('projectId', projectId);
        }
        return this.request('/documents/upload', {
            method: 'POST',
            body: formData,
            headers: {} // Let browser set Content-Type for FormData
        });
    }
    async analyzeContext(data) {
        return this.request('/context/analyze', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }
    async createVisualization(data) {
        return this.request('/visualizations', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }
    async exportVisualization(visualizationId, format) {
        return this.request(`/exports/visualization/${visualizationId}`, {
            method: 'POST',
            body: JSON.stringify({ format })
        });
    }
}
exports.SectorClient = SectorClient;
//# sourceMappingURL=sector-client.js.map