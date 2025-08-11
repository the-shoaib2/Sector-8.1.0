import * as vscode from 'vscode';
import { SectorClient } from '../clients/sector-client';

export class SectorProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'synapse.projects';

  constructor(private readonly synapseClient: SectorClient) {}

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken,
  ) {
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.joinPath(vscode.extensions.getExtension('synapse.synapse-learning-platform')?.extensionUri || vscode.Uri.file(__dirname), 'media'),
        vscode.Uri.joinPath(vscode.extensions.getExtension('synapse.synapse-learning-platform')?.extensionUri || vscode.Uri.file(__dirname), 'out/compiled'),
      ],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    // Handle messages from the webview
    webviewView.webview.onDidReceiveMessage(
      message => {
        switch (message.command) {
          case 'refresh':
            this._updateProjects(webviewView);
            return;
          case 'login':
            vscode.commands.executeCommand('synapse.login');
            return;
          case 'logout':
            vscode.commands.executeCommand('synapse.logout');
            return;
        }
      }
    );

    // Initial load
    this._updateProjects(webviewView);
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Synapse Projects</title>
        <style>
            body {
                padding: 10px;
                font-family: var(--vscode-font-family);
                color: var(--vscode-foreground);
                background-color: var(--vscode-editor-background);
            }
            .header {
                text-align: center;
                margin-bottom: 20px;
                padding-bottom: 15px;
                border-bottom: 1px solid var(--vscode-panel-border);
            }
            .title {
                font-size: 1.2em;
                font-weight: bold;
                margin-bottom: 5px;
                background: linear-gradient(45deg, #3b82f6, #8b5cf6);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
            .subtitle {
                font-size: 0.9em;
                color: var(--vscode-descriptionForeground);
            }
            .auth-section {
                text-align: center;
                padding: 20px;
            }
            .login-btn {
                background-color: var(--vscode-button-background);
                color: var(--vscode-button-foreground);
                border: none;
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                margin-bottom: 10px;
            }
            .login-btn:hover {
                background-color: var(--vscode-button-hoverBackground);
            }
            .project-item {
                padding: 8px;
                margin: 4px 0;
                border: 1px solid var(--vscode-panel-border);
                border-radius: 4px;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            .project-item:hover {
                background-color: var(--vscode-list-hoverBackground);
                border-color: var(--vscode-focusBorder);
            }
            .project-name {
                font-weight: bold;
                margin-bottom: 4px;
            }
            .project-description {
                font-size: 0.9em;
                color: var(--vscode-descriptionForeground);
            }
            .project-meta {
                font-size: 0.8em;
                color: var(--vscode-descriptionForeground);
                margin-top: 4px;
            }
            .loading {
                text-align: center;
                color: var(--vscode-descriptionForeground);
                font-style: italic;
                padding: 20px;
            }
            .error {
                color: var(--vscode-errorForeground);
                padding: 8px;
                border: 1px solid var(--vscode-errorForeground);
                border-radius: 4px;
                margin: 8px 0;
                text-align: center;
            }
            .empty-state {
                text-align: center;
                padding: 30px 20px;
                color: var(--vscode-descriptionForeground);
            }
            .empty-state-icon {
                font-size: 3em;
                margin-bottom: 15px;
                opacity: 0.5;
            }
            .empty-state-title {
                font-size: 1.1em;
                font-weight: bold;
                margin-bottom: 8px;
            }
            .empty-state-description {
                font-size: 0.9em;
                line-height: 1.4;
            }
            .actions {
                margin-top: 15px;
                text-align: center;
            }
            .action-btn {
                background-color: var(--vscode-button-secondaryBackground);
                color: var(--vscode-button-secondaryForeground);
                border: none;
                padding: 6px 12px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                margin: 0 5px;
            }
            .action-btn:hover {
                background-color: var(--vscode-button-secondaryHoverBackground);
            }
        </style>
    </head>
    <body>
        <div class="header">
            <div class="title">Synapse</div>
            <div class="subtitle">Learning Platform</div>
        </div>
        
        <div id="content">
            <div class="loading">Loading...</div>
        </div>
        
        <script>
            const vscode = acquireVsCodeApi();
            
            // Handle messages from extension
            window.addEventListener('message', event => {
                const message = event.data;
                switch (message.type) {
                    case 'updateProjects':
                        updateProjectsList(message.projects, message.isAuthenticated);
                        break;
                    case 'error':
                        showError(message.message);
                        break;
                }
            });
            
            function updateProjectsList(projects, isAuthenticated) {
                const container = document.getElementById('content');
                
                if (!isAuthenticated) {
                    container.innerHTML = \`
                        <div class="auth-section">
                            <div class="empty-state-icon">🔐</div>
                            <div class="empty-state-title">Authentication Required</div>
                            <div class="empty-state-description">
                                Please log in to access your Synapse projects and learning resources.
                            </div>
                            <button class="login-btn" onclick="login()">Sign In to Synapse</button>
                        </div>
                    \`;
                    return;
                }
                
                if (projects.length === 0) {
                    container.innerHTML = \`
                        <div class="empty-state">
                            <div class="empty-state-icon">📚</div>
                            <div class="empty-state-title">No Projects Yet</div>
                            <div class="empty-state-description">
                                Get started by creating your first learning project in Synapse.
                            </div>
                            <div class="actions">
                                <button class="action-btn" onclick="createProject()">Create Project</button>
                                <button class="action-btn" onclick="openTutorial()">View Tutorial</button>
                            </div>
                        </div>
                    \`;
                    return;
                }
                
                container.innerHTML = \`
                    <div class="projects-list">
                        \${projects.map(project => \`
                            <div class="project-item" onclick="openProject('\${project.id}')">
                                <div class="project-name">\${project.name}</div>
                                <div class="project-description">\${project.description || 'No description'}</div>
                                <div class="project-meta">
                                    \${project.language || 'Unknown'} • \${project.fileCount || 0} files • \${project.lastModified || 'Never'}
                                </div>
                            </div>
                        \`).join('')}
                    </div>
                    <div class="actions">
                        <button class="action-btn" onclick="createProject()">New Project</button>
                        <button class="action-btn" onclick="refreshProjects()">Refresh</button>
                    </div>
                \`;
            }
            
            function showError(message) {
                const container = document.getElementById('content');
                container.innerHTML = \`<div class="error">\${message}</div>\`;
            }
            
            function login() {
                vscode.postMessage({ command: 'login' });
            }
            
            function logout() {
                vscode.postMessage({ command: 'logout' });
            }
            
            function createProject() {
                vscode.postMessage({ command: 'createProject' });
            }
            
            function openProject(projectId) {
                vscode.postMessage({ command: 'openProject', projectId: projectId });
            }
            
            function openTutorial() {
                vscode.postMessage({ command: 'openTutorial' });
            }
            
            function refreshProjects() {
                vscode.postMessage({ command: 'refresh' });
            }
        </script>
    </body>
    </html>`;
  }

  private async _updateProjects(webviewView: vscode.WebviewView) {
    try {
      // Check if user is authenticated
      const authToken = vscode.workspace.getConfiguration('synapse').get('authToken');
      const isAuthenticated = !!authToken;
      
      if (!isAuthenticated) {
        webviewView.webview.postMessage({
          type: 'updateProjects',
          projects: [],
          isAuthenticated: false
        });
        return;
      }

      // Try to get projects
      try {
        const projects = await this.synapseClient.getProjects();
        
        // Transform projects to include additional metadata
        const transformedProjects = projects.map(project => ({
          ...project,
          fileCount: project.sourceFiles?.length || 0,
          lastModified: project.updatedAt ? new Date(project.updatedAt).toLocaleDateString() : 'Never'
        }));
        
        webviewView.webview.postMessage({
          type: 'updateProjects',
          projects: transformedProjects,
          isAuthenticated: true
        });
      } catch (error) {
        // If getting projects fails, user might not be authenticated
        console.error('Failed to get projects:', error);
        webviewView.webview.postMessage({
          type: 'updateProjects',
          projects: [],
          isAuthenticated: false
        });
      }
      
    } catch (error) {
      webviewView.webview.postMessage({
        type: 'error',
        message: 'Failed to load projects'
      });
    }
  }
}
