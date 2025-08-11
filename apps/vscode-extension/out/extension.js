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
const sectorClient_1 = require("./sectorClient");
const sectorProvider_1 = require("./sectorProvider");
const webviewProvider_1 = require("./webviewProvider");
const commands_1 = require("./commands");
function activate(context) {
    console.log('🚀 Sector Learning Platform extension is now active!');
    // Initialize Sector client
    const sectorClient = new sectorClient_1.SectorClient(context);
    // Initialize providers
    const sectorProvider = new sectorProvider_1.SectorProvider(context, sectorClient);
    const webviewProvider = new webviewProvider_1.SectorWebviewProvider(context, sectorClient);
    // Initialize commands
    const sectorCommands = new commands_1.SectorCommands(context, sectorClient);
    // Register tree data provider for projects
    const projectsTreeProvider = sectorProvider.createProjectsTreeProvider();
    vscode.window.registerTreeDataProvider('sector.projects', projectsTreeProvider);
    // Register tree data provider for AI assistant
    const assistantTreeProvider = sectorProvider.createAssistantTreeProvider();
    vscode.window.registerTreeDataProvider('sector.assistant', assistantTreeProvider);
    // Register tree data provider for visualizations
    const visualizationsTreeProvider = sectorProvider.createVisualizationsTreeProvider();
    vscode.window.registerTreeDataProvider('sector.visualizations', visualizationsTreeProvider);
    // Register commands
    context.subscriptions.push(vscode.commands.registerCommand('sector.login', () => sectorCommands.login()), vscode.commands.registerCommand('sector.logout', () => sectorCommands.logout()), vscode.commands.registerCommand('sector.showAssistant', () => sectorCommands.showAssistant()), vscode.commands.registerCommand('sector.visualizeCode', () => sectorCommands.visualizeCode()), vscode.commands.registerCommand('sector.analyzeContext', () => sectorCommands.analyzeContext()), vscode.commands.registerCommand('sector.exportVisualization', () => sectorCommands.exportVisualization()));
    // Check authentication status on startup
    sectorClient.checkAuthStatus().then(isAuthenticated => {
        if (isAuthenticated) {
            vscode.window.showInformationMessage('✅ Sector: Successfully authenticated');
        }
        else {
            vscode.window.showInformationMessage('🔐 Sector: Please login to access features');
        }
    });
    // Set up status bar
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
    statusBarItem.text = '$(code) Sector';
    statusBarItem.tooltip = 'Sector Learning Platform';
    statusBarItem.command = 'sector.showAssistant';
    statusBarItem.show();
    context.subscriptions.push(statusBarItem);
    // Update status bar based on auth status
    sectorClient.onAuthStatusChanged((isAuthenticated) => {
        if (isAuthenticated) {
            statusBarItem.text = '$(code) Sector';
            statusBarItem.tooltip = 'Sector Learning Platform - Authenticated';
        }
        else {
            statusBarItem.text = '$(code) Sector (Login Required)';
            statusBarItem.tooltip = 'Sector Learning Platform - Click to login';
        }
    });
    console.log('✅ Sector extension activated successfully');
}
function deactivate() {
    console.log('👋 Sector Learning Platform extension deactivated');
}
//# sourceMappingURL=extension.js.map