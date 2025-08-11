"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const synapse_provider_1 = require("./providers/synapse-provider");
const webview_provider_1 = require("./providers/webview-provider");
const login_provider_1 = require("./providers/login-provider");
const synapse_client_1 = require("./clients/synapse-client");
function activate(context) {
    console.log('Synapse Learning Platform extension is now active!');
    // Initialize Synapse client
    const synapseClient = new synapse_client_1.SectorClient();
    // Register Synapse provider
    const synapseProvider = new synapse_provider_1.SectorProvider(synapseClient);
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
//# sourceMappingURL=extension.js.map