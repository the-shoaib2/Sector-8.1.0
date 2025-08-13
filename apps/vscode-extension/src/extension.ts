import * as vscode from 'vscode';
import { SectorProvider } from './providers/synapse-provider';
import { WebviewProvider } from './providers/webview-provider';
import { AuthService } from './services/auth-service';

let authService: AuthService;

export function activate(context: vscode.ExtensionContext) {
  console.log('Synapse Learning Platform extension is now active!');

  try {
    // Initialize authentication service
    authService = new AuthService(context);

    // Register providers
    const synapseProvider = new SectorProvider(context, authService);
    const webviewProvider = new WebviewProvider(context, authService);

    // Register commands
    const loginCommand = vscode.commands.registerCommand('synapse.login', async () => {
      const success = await authService.login();
      if (success) {
        vscode.window.showInformationMessage('Login successful!');
      }
    });

    const logoutCommand = vscode.commands.registerCommand('synapse.logout', async () => {
      await authService.logout();
    });

    const openProjectCommand = vscode.commands.registerCommand('synapse.openProject', async () => {
      if (!authService.isAuthenticated()) {
        vscode.window.showWarningMessage('Please log in first');
        return;
      }

      try {
        const client = authService.getClient();
        const projects = await client.getProjects();
        
        if (projects.length === 0) {
          vscode.window.showInformationMessage('No projects found. Create your first project!');
          return;
        }

        const projectNames = projects.map(p => p.name);
        const selectedProject = await vscode.window.showQuickPick(projectNames, {
          placeHolder: 'Select a project to open'
        });

        if (selectedProject) {
          const project = projects.find(p => p.name === selectedProject);
          if (project) {
            // Open project in webview or show project details
            webviewProvider.showProject(project);
          }
        }
      } catch (error) {
        vscode.window.showErrorMessage(`Failed to load projects: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    });

    const showAssistantCommand = vscode.commands.registerCommand('synapse.showAssistant', async () => {
      if (!authService.isAuthenticated()) {
        vscode.window.showWarningMessage('Please log in first');
        return;
      }

      // Show AI assistant webview
      webviewProvider.showAssistant();
    });

    const visualizeCodeCommand = vscode.commands.registerCommand('synapse.visualizeCode', async () => {
      if (!authService.isAuthenticated()) {
        vscode.window.showWarningMessage('Please log in first');
        return;
      }

      const editor = vscode.window.activeTextEditor;
      if (editor) {
        const document = editor.document;
        const code = document.getText();
        
        try {
          const client = authService.getClient();
          // Create a visualization for the current code
          const visualization = await client.createVisualization('current', {
            type: 'code-flow',
            config: {
              language: document.languageId,
              code: code
            }
          });
          
          webviewProvider.showVisualization(visualization);
        } catch (error) {
          vscode.window.showErrorMessage(`Failed to create visualization: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      } else {
        vscode.window.showWarningMessage('No active editor found');
      }
    });

    const analyzeContextCommand = vscode.commands.registerCommand('synapse.analyzeContext', async () => {
      if (!authService.isAuthenticated()) {
        vscode.window.showWarningMessage('Please log in first');
        return;
      }

      const editor = vscode.window.activeTextEditor;
      if (editor) {
        const document = editor.document;
        const code = document.getText();
        const selection = editor.selection;
        const selectedCode = document.getText(selection);
        
        const prompt = await vscode.window.showInputBox({
          placeHolder: 'What would you like to analyze about this code?',
          prompt: 'Analysis prompt',
          value: selectedCode ? `Analyze this selected code: ${selectedCode}` : `Analyze this ${document.languageId} file`
        });

        if (prompt) {
          try {
            const client = authService.getClient();
            const response = await client.sendPrompt('current', prompt, {
              file: document.fileName,
              language: document.languageId,
              code: code,
              selection: selectedCode
            });
            
            webviewProvider.showAnalysis(response);
          } catch (error) {
            vscode.window.showErrorMessage(`Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        }
      } else {
        vscode.window.showWarningMessage('No active editor found');
      }
    });

    const exportVisualizationCommand = vscode.commands.registerCommand('synapse.exportVisualization', async () => {
      if (!authService.isAuthenticated()) {
        vscode.window.showWarningMessage('Please log in first');
        return;
      }

      const format = await vscode.window.showQuickPick(['PNG', 'SVG', 'PDF'], {
        placeHolder: 'Select export format'
      });

      if (format) {
        try {
          const client = authService.getClient();
          const blob = await client.exportVisualization('current', format.toLowerCase() as 'png' | 'svg' | 'pdf');
          
          // Save the blob to a file
          const uri = await vscode.window.showSaveDialog({
            filters: {
              [format]: [format.toLowerCase()]
            }
          });

          if (uri) {
            const arrayBuffer = await blob.arrayBuffer();
            const uint8Array = new Uint8Array(arrayBuffer);
            await vscode.workspace.fs.writeFile(uri, uint8Array);
            vscode.window.showInformationMessage(`Visualization exported to ${uri.fsPath}`);
          }
        } catch (error) {
          vscode.window.showErrorMessage(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    });

    // Add all commands to subscriptions
    context.subscriptions.push(
      loginCommand,
      logoutCommand,
      openProjectCommand,
      showAssistantCommand,
      visualizeCodeCommand,
      analyzeContextCommand,
      exportVisualizationCommand,
      synapseProvider,
      webviewProvider
    );

    // Register status bar item
    context.subscriptions.push(authService);

    console.log('All commands and providers registered successfully');
    
  } catch (error) {
    console.error('Error during extension activation:', error);
    vscode.window.showErrorMessage(`Extension activation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export function deactivate() {
  console.log('Synapse Learning Platform extension is now deactivated!');
  if (authService) {
    authService.dispose();
  }
}
