export class SectorClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor() {
    // Use the web app's URL instead of a separate API
    this.baseUrl = process.env.SYNAPSE_WEB_URL || 'http://localhost:3000';
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
        const errorData = await response.json().catch(() => ({})) as any;
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data as T;
    } catch (error) {
      console.error('Synapse API request failed:', error);
      throw error;
    }
  }

  async healthCheck(): Promise<{ status: string }> {
    return this.request<{ status: string }>('/api/health');
  }

  async login(email: string, password: string): Promise<{ token: string; user: any }> {
    // Use the VS Code-specific auth endpoint
    const response = await this.request<{ token: string; user: any }>('/api/auth/callback/vscode', {
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

  async loginWithOAuth(provider: 'google' | 'github'): Promise<string> {
    // Return OAuth URL for the user to complete in browser
    return `${this.baseUrl}/api/auth/signin/${provider}?callbackUrl=${encodeURIComponent('/api/auth/callback/vscode')}`;
  }

  async logout(): Promise<void> {
    try {
      await this.request('/api/auth/signout', { method: 'POST' });
    } finally {
      this.clearToken();
    }
  }

  async getCurrentUser(): Promise<any> {
    return this.request('/api/auth/callback/vscode');
  }

  async getProjects(): Promise<any[]> {
    return this.request<any[]>('/api/projects');
  }

  async getProject(id: string): Promise<any> {
    return this.request<any>(`/api/projects/${id}`);
  }

  async createProject(data: { name: string; description?: string; visibility?: string }): Promise<any> {
    return this.request<any>('/api/projects', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async updateProject(id: string, data: Partial<any>): Promise<any> {
    return this.request<any>(`/api/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async deleteProject(id: string): Promise<void> {
    await this.request(`/api/projects/${id}`, { method: 'DELETE' });
  }

  async executeCode(projectId: string, data: { language: string; entryPoint: string; args?: string[] }): Promise<any> {
    return this.request<any>('/api/runs', {
      method: 'POST',
      body: JSON.stringify({
        projectId,
        ...data
      })
    });
  }

  async sendPrompt(projectId: string, prompt: string, context?: any): Promise<any> {
    return this.request<any>('/api/prompts', {
      method: 'POST',
      body: JSON.stringify({
        projectId,
        prompt,
        context
      })
    });
  }

  async getRuns(projectId?: string): Promise<any[]> {
    const endpoint = projectId ? `/api/runs?projectId=${projectId}` : '/api/runs';
    return this.request<any[]>(endpoint);
  }

  async getRun(id: string): Promise<any> {
    return this.request<any>(`/api/runs/${id}`);
  }

  async createVisualization(projectId: string, data: { type: string; config: any }): Promise<any> {
    return this.request<any>('/api/visualizations', {
      method: 'POST',
      body: JSON.stringify({
        projectId,
        ...data
      })
    });
  }

  async getVisualizations(projectId?: string): Promise<any[]> {
    const endpoint = projectId ? `/api/visualizations?projectId=${projectId}` : '/api/visualizations';
    return this.request<any[]>(endpoint);
  }

  async exportVisualization(id: string, format: 'png' | 'svg' | 'pdf'): Promise<Blob> {
    const response = await fetch(`${this.baseUrl}/api/visualizations/${id}/export?format=${format}`, {
      headers: this.token ? { 'Authorization': `Bearer ${this.token}` } : {}
    });
    
    if (!response.ok) {
      throw new Error(`Export failed: ${response.status}`);
    }
    
    return response.blob();
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.token;
  }

  // Get stored token
  getToken(): string | null {
    return this.token;
  }
}
