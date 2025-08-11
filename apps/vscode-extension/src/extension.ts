import * as vscode from 'vscode';
import { SectorProvider } from './providers/sector-provider';
import { WebviewProvider } from './providers/webview-provider';
import { SectorClient } from './clients/sector-client';

export function activate(context: vscode.ExtensionContext) {
  console.log('Sector Learning Platform extension is now active!');

  // Initialize Sector client
  const sectorClient = new SectorClient();

  // Register Sector provider
  const sectorProvider = new SectorProvider(sectorClient);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider('sector.projects', sectorProvider)
  );

  // Register Webview provider
  const webviewProvider = new WebviewProvider(context.extensionUri, sectorClient);

  // Register commands
  context.subscriptions.push(
    vscode.commands.registerCommand('sector.login', () => {
      vscode.window.showInformationMessage('Sector: Login functionality coming soon!');
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('sector.logout', () => {
      vscode.window.showInformationMessage('Sector: Logout functionality coming soon!');
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('sector.openProject', () => {
      vscode.window.showInformationMessage('Sector: Open project functionality coming soon!');
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('sector.showAssistant', () => {
      webviewProvider.showAssistant();
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('sector.visualizeCode', () => {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        webviewProvider.showVisualization(editor.document.uri);
      } else {
        vscode.window.showWarningMessage('No active editor found');
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('sector.analyzeContext', () => {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        webviewProvider.showContextAnalysis(editor.document.uri);
      } else {
        vscode.window.showWarningMessage('No active editor found');
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('sector.exportVisualization', () => {
      vscode.window.showInformationMessage('Sector: Export visualization functionality coming soon!');
    })
  );
}

export function deactivate() {
  console.log('Sector Learning Platform extension is now deactivated!');
}
