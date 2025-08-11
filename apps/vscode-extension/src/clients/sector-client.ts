export class SectorClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor() {
    this.baseUrl = process.env.SECTOR_API_URL || 'http://localhost:3001';
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
      console.error('Sector API request failed:', error);
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
      body: JSON.stringify({ projectId, ...data })
    });
  }

  async getRunStatus(runId: string): Promise<any> {
    return this.request<any>(`/runs/${runId}`);
  }

  async sendPrompt(data: { message: string; context?: string; projectId?: string }): Promise<any> {
    return this.request<any>('/prompts', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async uploadDocument(file: File, projectId?: string): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    if (projectId) {
      formData.append('projectId', projectId);
    }

    return this.request<any>('/documents/upload', {
      method: 'POST',
      body: formData,
      headers: {} // Let browser set Content-Type for FormData
    });
  }

  async analyzeContext(data: { query: string; documentIds: string[] }): Promise<any> {
    return this.request<any>('/context/analyze', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async createVisualization(data: { type: string; data: any; projectId?: string }): Promise<any> {
    return this.request<any>('/visualizations', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async exportVisualization(visualizationId: string, format: string): Promise<any> {
    return this.request<any>(`/exports/visualization/${visualizationId}`, {
      method: 'POST',
      body: JSON.stringify({ format })
    });
  }
}
