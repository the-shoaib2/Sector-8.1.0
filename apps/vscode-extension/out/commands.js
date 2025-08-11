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
exports.SectorCommands = void 0;
const vscode = __importStar(require("vscode"));
class SectorCommands {
    constructor(context, sectorClient) {
        this.context = context;
        this.sectorClient = sectorClient;
    }
    async login() {
        const success = await this.sectorClient.login();
        if (success) {
            vscode.window.showInformationMessage('✅ Successfully logged in to Sector');
        }
    }
    async logout() {
        await this.sectorClient.logout();
        vscode.window.showInformationMessage('👋 Logged out from Sector');
    }
    async showAssistant() {
        try {
            const prompt = await vscode.window.showInputBox({
                prompt: 'Ask Sector AI Assistant',
                placeHolder: 'How can I help you with your code today?'
            });
            if (!prompt) {
                return;
            }
            const response = await this.sectorClient.submitPrompt(prompt);
            if (response.status === 'completed' && response.response) {
                vscode.window.showInformationMessage(`AI Response: ${response.response.substring(0, 100)}...`);
            }
            else {
                vscode.window.showInformationMessage('AI response is being processed...');
            }
        }
        catch (error) {
            vscode.window.showErrorMessage(`Failed to get AI response: ${error}`);
        }
    }
    async visualizeCode() {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor found');
            return;
        }
        const document = editor.document;
        const code = document.getText();
        if (!code.trim()) {
            vscode.window.showErrorMessage('No code to visualize');
            return;
        }
        vscode.window.showInformationMessage(`✅ Code visualization created for ${document.fileName}`);
    }
    async analyzeContext() {
        vscode.window.showInformationMessage('Context analysis feature coming soon!');
    }
    async exportVisualization() {
        vscode.window.showInformationMessage('Export feature coming soon!');
    }
}
exports.SectorCommands = SectorCommands;
//# sourceMappingURL=commands.js.map