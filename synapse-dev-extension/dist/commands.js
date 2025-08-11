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
exports.registerCommands = registerCommands;
const vscode = __importStar(require("vscode"));
function registerCommands(context) {
    const disposables = [];
    // Login command
    disposables.push(vscode.commands.registerCommand('sector.login', async () => {
        const email = await vscode.window.showInputBox({
            prompt: 'Enter your email',
            placeHolder: 'user@example.com'
        });
        if (!email)
            return;
        const password = await vscode.window.showInputBox({
            prompt: 'Enter your password',
            password: true
        });
        if (!password)
            return;
        try {
            // TODO: Implement actual login
            vscode.window.showInformationMessage('Login functionality coming soon!');
        }
        catch (error) {
            vscode.window.showErrorMessage(`Login failed: ${error}`);
        }
    }));
    // Logout command
    disposables.push(vscode.commands.registerCommand('sector.logout', () => {
        // TODO: Implement actual logout
        vscode.window.showInformationMessage('Logout functionality coming soon!');
    }));
    // Open project command
    disposables.push(vscode.commands.registerCommand('sector.openProject', async () => {
        const projectName = await vscode.window.showInputBox({
            prompt: 'Enter project name',
            placeHolder: 'my-project'
        });
        if (!projectName)
            return;
        try {
            // TODO: Implement actual project opening
            vscode.window.showInformationMessage(`Opening project: ${projectName}`);
        }
        catch (error) {
            vscode.window.showErrorMessage(`Failed to open project: ${error}`);
        }
    }));
    // Show assistant command
    disposables.push(vscode.commands.registerCommand('sector.showAssistant', () => {
        // This will be handled by the WebviewProvider
        vscode.window.showInformationMessage('Opening Sector AI Assistant...');
    }));
    // Visualize code command
    disposables.push(vscode.commands.registerCommand('sector.visualizeCode', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            // This will be handled by the WebviewProvider
            vscode.window.showInformationMessage('Opening code visualization...');
        }
        else {
            vscode.window.showWarningMessage('No active editor found');
        }
    }));
    // Analyze context command
    disposables.push(vscode.commands.registerCommand('sector.analyzeContext', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            // This will be handled by the WebviewProvider
            vscode.window.showInformationMessage('Opening context analysis...');
        }
        else {
            vscode.window.showWarningMessage('No active editor found');
        }
    }));
    // Export visualization command
    disposables.push(vscode.commands.registerCommand('sector.exportVisualization', async () => {
        const format = await vscode.window.showQuickPick(['PDF', 'PNG', 'JPEG', 'SVG', 'DOCX', 'PPTX'], {
            placeHolder: 'Select export format'
        });
        if (!format)
            return;
        try {
            // TODO: Implement actual export
            vscode.window.showInformationMessage(`Exporting visualization as ${format}...`);
        }
        catch (error) {
            vscode.window.showErrorMessage(`Export failed: ${error}`);
        }
    }));
    // Create project command
    disposables.push(vscode.commands.registerCommand('sector.createProject', async () => {
        const projectName = await vscode.window.showInputBox({
            prompt: 'Enter project name',
            placeHolder: 'my-new-project'
        });
        if (!projectName)
            return;
        const description = await vscode.window.showInputBox({
            prompt: 'Enter project description (optional)',
            placeHolder: 'A brief description of your project'
        });
        const visibility = await vscode.window.showQuickPick(['private', 'shared', 'public'], {
            placeHolder: 'Select project visibility'
        });
        if (!visibility)
            return;
        try {
            // TODO: Implement actual project creation
            vscode.window.showInformationMessage(`Creating project: ${projectName}`);
        }
        catch (error) {
            vscode.window.showErrorMessage(`Failed to create project: ${error}`);
        }
    }));
    // Execute code command
    disposables.push(vscode.commands.registerCommand('sector.executeCode', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showWarningMessage('No active editor found');
            return;
        }
        const language = await vscode.window.showQuickPick(['python', 'javascript', 'typescript', 'java', 'cpp', 'go', 'rust'], {
            placeHolder: 'Select programming language'
        });
        if (!language)
            return;
        const entryPoint = await vscode.window.showInputBox({
            prompt: 'Enter entry point file',
            value: editor.document.fileName.split('/').pop() || 'main.py',
            placeHolder: 'main.py'
        });
        if (!entryPoint)
            return;
        try {
            // TODO: Implement actual code execution
            vscode.window.showInformationMessage(`Executing ${language} code with entry point: ${entryPoint}`);
        }
        catch (error) {
            vscode.window.showErrorMessage(`Code execution failed: ${error}`);
        }
    }));
    return disposables;
}
//# sourceMappingURL=commands.js.map