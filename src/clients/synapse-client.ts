export class SynapseClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor() {
    this.baseUrl = process.env.SYNAPSE_API_URL || 'http://localhost:3001';
  }

  setToken(token: string): void {
    this.token = token;
  }

  clearToken(): void {
    this.token = null;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>
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
      return data as T;
    } catch (error) {
      console.error('Synapse API request failed:', error);
      throw error;
    }
  }

  async healthCheck(): Promise<{ status: string }> {
    return this.request<{ status: string }>('/health');
  }

  async login(email: string, password: string): Promise<{ token: string; user: any }> {
    const response = await this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    this.setToken(response.token);
    return response;
  }

  async logout(): Promise<void> {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } finally {
      this.clearToken();
    }
  }

  async getCurrentUser(): Promise<any> {
    return this.request('/auth/me');
  }

  async getProjects(): Promise<any[]> {
    return this.request<any[]>('/projects');
  }

  async getProject(id: string): Promise<any> {
    return this.request<any>(`/projects/${id}`);
  }

  async createProject(data: { name: string; description?: string; visibility?: string }): Promise<any> {
    return this.request<any>('/projects', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async updateProject(id: string, data: Partial<any>): Promise<any> {
    return this.request<any>(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async deleteProject(id: string): Promise<void> {
    await this.request(`/projects/${id}`, { method: 'DELETE' });
  }

  async executeCode(projectId: string, data: { language: string; entryPoint: string; args?: string[] }): Promise<any> {
    return this.request<any>('/runs', {
      method: 'POST',
      body: JSON.stringify({
        projectId,
        ...data
      })
    });
  }

  async getRun(id: string): Promise<any> {
    return this.request<any>(`/runs/${id}`);
  }

  async getRunLogs(id: string): Promise<any> {
    return this.request<any>(`/runs/${id}/logs`);
  }

  async stopRun(id: string): Promise<void> {
    await this.request(`/runs/${id}/stop`, { method: 'POST' });
  }

  async uploadFile(projectId: string, file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('projectId', projectId);

    return this.request<any>('/files/upload', {
      method: 'POST',
      body: formData
    });
  }

  async getFiles(projectId: string): Promise<any[]> {
    return this.request<any[]>(`/projects/${projectId}/files`);
  }

  async deleteFile(fileId: string): Promise<void> {
    await this.request(`/files/${fileId}`, { method: 'DELETE' });
  }

  async analyzeCode(projectId: string, data: { language: string; code: string }): Promise<any> {
    return this.request<any>('/ai/analyze', {
      method: 'POST',
      body: JSON.stringify({
        projectId,
        ...data
      })
    });
  }

  async generateCode(projectId: string, data: { language: string; prompt: string; context?: string }): Promise<any> {
    return this.request<any>('/ai/generate', {
      method: 'POST',
      body: JSON.stringify({
        projectId,
        ...data
      })
    });
  }

  async explainCode(projectId: string, data: { language: string; code: string }): Promise<any> {
    return this.request<any>('/ai/explain', {
      method: 'POST',
      body: JSON.stringify({
        projectId,
        ...data
      })
    });
  }

  async createVisualization(projectId: string, data: { type: string; data: any; options?: any }): Promise<any> {
    return this.request<any>('/visualizations', {
      method: 'POST',
      body: JSON.stringify({
        projectId,
        ...data
      })
    });
  }

  async getVisualizations(projectId: string): Promise<any[]> {
    return this.request<any[]>(`/projects/${projectId}/visualizations`);
  }

  async exportVisualization(id: string, format: string): Promise<any> {
    return this.request<any>(`/visualizations/${id}/export`, {
      method: 'POST',
      body: JSON.stringify({ format })
    });
  }

  async searchDocuments(query: string, filters?: any): Promise<any[]> {
    const params = new URLSearchParams({ q: query });
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        params.append(key, value as string);
      });
    }
    
    return this.request<any[]>(`/documents/search?${params.toString()}`);
  }

  async getDocument(id: string): Promise<any> {
    return this.request<any>(`/documents/${id}`);
  }

  async uploadDocument(file: File, metadata?: any): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    if (metadata) {
      formData.append('metadata', JSON.stringify(metadata));
    }

    return this.request<any>('/documents/upload', {
      method: 'POST',
      body: formData
    });
  }

  async getContextSession(id: string): Promise<any> {
    return this.request<any>(`/context-sessions/${id}`);
  }

  async createContextSession(data: { name: string; documents: string[]; description?: string }): Promise<any> {
    return this.request<any>('/context-sessions', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async queryContext(sessionId: string, query: string): Promise<any> {
    return this.request<any>(`/context-sessions/${sessionId}/query`, {
      method: 'POST',
      body: JSON.stringify({ query })
    });
  }
}
