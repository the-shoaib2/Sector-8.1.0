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
const auth_service_1 = require("./services/auth-service");
let authService;
function activate(context) {
    console.log('Synapse Learning Platform extension is now active!');
    try {
        // Initialize authentication service
        authService = new auth_service_1.AuthService(context);
        // Register providers
        const synapseProvider = new synapse_provider_1.SectorProvider(context, authService);
        const webviewProvider = new webview_provider_1.WebviewProvider(context, authService);
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
            }
            catch (error) {
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
                }
                catch (error) {
                    vscode.window.showErrorMessage(`Failed to create visualization: ${error instanceof Error ? error.message : 'Unknown error'}`);
                }
            }
            else {
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
                    }
                    catch (error) {
                        vscode.window.showErrorMessage(`Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
                    }
                }
            }
            else {
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
                    const blob = await client.exportVisualization('current', format.toLowerCase());
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
                }
                catch (error) {
                    vscode.window.showErrorMessage(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
                }
            }
        });
        // Add all commands to subscriptions
        context.subscriptions.push(loginCommand, logoutCommand, openProjectCommand, showAssistantCommand, visualizeCodeCommand, analyzeContextCommand, exportVisualizationCommand, synapseProvider, webviewProvider);
        // Register status bar item
        context.subscriptions.push(authService);
        console.log('All commands and providers registered successfully');
    }
    catch (error) {
        console.error('Error during extension activation:', error);
        vscode.window.showErrorMessage(`Extension activation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
function deactivate() {
    console.log('Synapse Learning Platform extension is now deactivated!');
    if (authService) {
        authService.dispose();
    }
}
//# sourceMappingURL=extension.js.map