"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SectorClient = void 0;
class SectorClient {
    baseUrl;
    token = null;
    constructor() {
        // Use the web app's URL instead of a separate API
        this.baseUrl = process.env.SYNAPSE_WEB_URL || 'http://localhost:3000';
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
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
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
        return this.request('/api/health');
    }
    async login(email, password) {
        // Use the VS Code-specific auth endpoint
        const response = await this.request('/api/auth/callback/vscode', {
            method: 'POST',
            body: JSON.stringify({
                email,
                password
            })
        });
        if (response.token) {
            this.setToken(response.token);
        }
        return response;
    }
    async loginWithOAuth(provider) {
        // Return OAuth URL for the user to complete in browser
        return `${this.baseUrl}/api/auth/signin/${provider}?callbackUrl=${encodeURIComponent('/api/auth/callback/vscode')}`;
    }
    async logout() {
        try {
            await this.request('/api/auth/signout', { method: 'POST' });
        }
        finally {
            this.clearToken();
        }
    }
    async getCurrentUser() {
        return this.request('/api/auth/callback/vscode');
    }
    async getProjects() {
        return this.request('/api/projects');
    }
    async getProject(id) {
        return this.request(`/api/projects/${id}`);
    }
    async createProject(data) {
        return this.request('/api/projects', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }
    async updateProject(id, data) {
        return this.request(`/api/projects/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }
    async deleteProject(id) {
        await this.request(`/api/projects/${id}`, { method: 'DELETE' });
    }
    async executeCode(projectId, data) {
        return this.request('/api/runs', {
            method: 'POST',
            body: JSON.stringify({
                projectId,
                ...data
            })
        });
    }
    async sendPrompt(projectId, prompt, context) {
        return this.request('/api/prompts', {
            method: 'POST',
            body: JSON.stringify({
                projectId,
                prompt,
                context
            })
        });
    }
    async getRuns(projectId) {
        const endpoint = projectId ? `/api/runs?projectId=${projectId}` : '/api/runs';
        return this.request(endpoint);
    }
    async getRun(id) {
        return this.request(`/api/runs/${id}`);
    }
    async createVisualization(projectId, data) {
        return this.request('/api/visualizations', {
            method: 'POST',
            body: JSON.stringify({
                projectId,
                ...data
            })
        });
    }
    async getVisualizations(projectId) {
        const endpoint = projectId ? `/api/visualizations?projectId=${projectId}` : '/api/visualizations';
        return this.request(endpoint);
    }
    async exportVisualization(id, format) {
        const response = await fetch(`${this.baseUrl}/api/visualizations/${id}/export?format=${format}`, {
            headers: this.token ? { 'Authorization': `Bearer ${this.token}` } : {}
        });
        if (!response.ok) {
            throw new Error(`Export failed: ${response.status}`);
        }
        return response.blob();
    }
    // Check if user is authenticated
    isAuthenticated() {
        return !!this.token;
    }
    // Get stored token
    getToken() {
        return this.token;
    }
}
exports.SectorClient = SectorClient;
//# sourceMappingURL=synapse-client.js.map