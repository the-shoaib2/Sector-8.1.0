"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = require("vscode");
const synapse_provider_1 = require("./providers/synapse-provider");
const webview_provider_1 = require("./providers/webview-provider");
const login_provider_1 = require("./providers/login-provider");
const synapse_client_1 = require("./clients/synapse-client");
function activate(context) {
    console.log('Synapse Learning Platform extension is now active!');
    // Initialize Synapse client
    const synapseClient = new synapse_client_1.SynapseClient();
    // Register Synapse provider
    const synapseProvider = new synapse_provider_1.SynapseProvider(synapseClient);
    context.subscriptions.push(vscode.window.registerWebviewViewProvider('synapse.projects', synapseProvider));
    // Register Webview provider
    const webviewProvider = new webview_provider_1.WebviewProvider(context.extensionUri, synapseClient);
    // Register Login provider
    const loginProvider = new login_provider_1.LoginProvider(context.extensionUri, synapseClient);
    // Register commands
    context.subscriptions.push(vscode.commands.registerCommand('synapse.login', () => {
        loginProvider.showLogin();
    }));
    context.subscriptions.push(vscode.commands.registerCommand('synapse.logout', async () => {
        try {
            await synapseClient.logout();
            // Clear stored token
            vscode.workspace.getConfiguration('synapse').update('authToken', undefined, vscode.ConfigurationTarget.Global);
            vscode.window.showInformationMessage('Successfully logged out of Synapse');
            // Refresh the projects view to show login state
            vscode.commands.executeCommand('workbench.action.reloadWindow');
        }
        catch (error) {
            console.error('Logout failed:', error);
            vscode.window.showErrorMessage('Logout failed. Please try again.');
        }
    }));
    context.subscriptions.push(vscode.commands.registerCommand('synapse.openProject', () => {
        vscode.window.showInformationMessage('Synapse: Open project functionality coming soon!');
    }));
    context.subscriptions.push(vscode.commands.registerCommand('synapse.showAssistant', () => {
        webviewProvider.showAssistant();
    }));
    context.subscriptions.push(vscode.commands.registerCommand('synapse.visualizeCode', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            webviewProvider.showVisualization(editor.document.uri);
        }
        else {
            vscode.window.showWarningMessage('No active editor found');
        }
    }));
    context.subscriptions.push(vscode.commands.registerCommand('synapse.analyzeContext', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            webviewProvider.showContextAnalysis(editor.document.uri);
        }
        else {
            vscode.window.showWarningMessage('No active editor found');
        }
    }));
    context.subscriptions.push(vscode.commands.registerCommand('synapse.exportVisualization', () => {
        vscode.window.showInformationMessage('Synapse: Export visualization functionality coming soon!');
    }));
    // Check if user is already authenticated
    const authToken = vscode.workspace.getConfiguration('synapse').get('authToken');
    if (authToken) {
        synapseClient.setToken(authToken);
        console.log('User already authenticated with Synapse');
    }
}
function deactivate() {
    console.log('Synapse Learning Platform extension is now deactivated!');
}
