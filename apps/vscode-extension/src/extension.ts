import * as vscode from 'vscode';
import { SectorProvider } from './providers/sector-provider';
import { WebviewProvider } from './providers/webview-provider';
import { SectorClient } from './clients/sector-client';

export function activate(context: vscode.ExtensionContext) {
  console.log('Synapse Learning Platform extension is now active!');

  // Initialize Synapse client
  const synapseClient = new SectorClient();

  // Register Synapse provider
  const synapseProvider = new SectorProvider(synapseClient);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider('synapse.projects', synapseProvider)
  );

  // Register Webview provider
  const webviewProvider = new WebviewProvider(context.extensionUri, synapseClient);

  // Register commands
  context.subscriptions.push(
    vscode.commands.registerCommand('synapse.login', () => {
      vscode.window.showInformationMessage('Synapse: Login functionality coming soon!');
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('synapse.logout', () => {
      vscode.window.showInformationMessage('Synapse: Logout functionality coming soon!');
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
}

export function deactivate() {
  console.log('Synapse Learning Platform extension is now deactivated!');
}
