import * as vscode from 'vscode';
import { SynapseProvider } from './providers/synapse-provider';
import { WebviewProvider } from './providers/webview-provider';
import { LoginProvider } from './providers/login-provider';
import { SynapseClient } from './clients/synapse-client';

export function activate(context: vscode.ExtensionContext) {
  console.log('Synapse Learning Platform extension is now active!');

  // Initialize Synapse client
  const synapseClient = new SynapseClient();

  // Register Synapse provider
  const synapseProvider = new SynapseProvider(synapseClient);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider('synapse.projects', synapseProvider)
  );

  // Register Webview provider
  const webviewProvider = new WebviewProvider(context.extensionUri, synapseClient);

  // Register Login provider
  const loginProvider = new LoginProvider(context.extensionUri, synapseClient);

  // Register commands
  context.subscriptions.push(
    vscode.commands.registerCommand('synapse.login', () => {
      loginProvider.showLogin();
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('synapse.logout', async () => {
      try {
        await synapseClient.logout();
        
        // Clear stored token
        vscode.workspace.getConfiguration('synapse').update('authToken', undefined, vscode.ConfigurationTarget.Global);
        
        vscode.window.showInformationMessage('Successfully logged out of Synapse');
        
        // Refresh the projects view to show login state
        vscode.commands.executeCommand('workbench.action.reloadWindow');
        
      } catch (error) {
        console.error('Logout failed:', error);
        vscode.window.showErrorMessage('Logout failed. Please try again.');
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('synapse.openProject', () => {
      vscode.window.showInformationMessage('Synapse: Open project functionality coming soon!');
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('synapse.showAssistant', () => {
      webviewProvider.showAssistant();
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('synapse.visualizeCode', () => {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        webviewProvider.showVisualization(editor.document.uri);
      } else {
        vscode.window.showWarningMessage('No active editor found');
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('synapse.analyzeContext', () => {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        webviewProvider.showContextAnalysis(editor.document.uri);
      } else {
        vscode.window.showWarningMessage('No active editor found');
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('synapse.exportVisualization', () => {
      vscode.window.showInformationMessage('Synapse: Export visualization functionality coming soon!');
    })
  );

  // Check if user is already authenticated
  const authToken = vscode.workspace.getConfiguration('synapse').get('authToken');
  if (authToken) {
    synapseClient.setToken(authToken as string);
    console.log('User already authenticated with Synapse');
  }
}

export function deactivate() {
  console.log('Synapse Learning Platform extension is now deactivated!');
}
