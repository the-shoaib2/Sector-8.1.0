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
            .project-item {
                padding: 8px;
                margin: 4px 0;
                border: 1px solid var(--vscode-panel-border);
                border-radius: 4px;
                cursor: pointer;
            }
            .project-item:hover {
                background-color: var(--vscode-list-hoverBackground);
            }
            .project-name {
                font-weight: bold;
                margin-bottom: 4px;
            }
            .project-description {
                font-size: 0.9em;
                color: var(--vscode-descriptionForeground);
            }
            .loading {
                text-align: center;
                color: var(--vscode-descriptionForeground);
                font-style: italic;
            }
            .error {
                color: var(--vscode-errorForeground);
                padding: 8px;
                border: 1px solid var(--vscode-errorForeground);
                border-radius: 4px;
                margin: 8px 0;
            }
        </style>
    </head>
    <body>
        <div id="projects">
            <div class="loading">Loading projects...</div>
        </div>
        <script>
            const vscode = acquireVsCodeApi();
            
            // Handle messages from extension
            window.addEventListener('message', event => {
                const message = event.data;
                switch (message.type) {
                    case 'updateProjects':
                        updateProjectsList(message.projects);
                        break;
                    case 'error':
                        showError(message.message);
                        break;
                }
            });
            
            function updateProjectsList(projects) {
                const container = document.getElementById('projects');
                if (projects.length === 0) {
                    container.innerHTML = '<div class="loading">No projects found</div>';
                    return;
                }
                
                container.innerHTML = projects.map(project => \`
                    <div class="project-item" onclick="openProject('\${project.id}')">
                        <div class="project-name">\${project.name}</div>
                        <div class="project-description">\${project.description || 'No description'}</div>
                    </div>
                \`).join('');
            }
            
            function showError(message) {
                const container = document.getElementById('projects');
                container.innerHTML = \`<div class="error">\${message}</div>\`;
            }
            
            function openProject(projectId) {
                vscode.postMessage({
                    command: 'openProject',
                    projectId: projectId
                });
            }
        </script>
    </body>
    </html>`;
  }

  private async _updateProjects(webviewView: vscode.WebviewView) {
    try {
      // TODO: Implement actual project fetching
      const projects = [
        {
          id: 'demo-1',
          name: 'Hello World',
          description: 'A sample project to get started'
        }
      ];

      webviewView.webview.postMessage({
        type: 'updateProjects',
        projects: projects
      });
    } catch (error) {
      webviewView.webview.postMessage({
        type: 'error',
        message: 'Failed to load projects'
      });
    }
  }
}
