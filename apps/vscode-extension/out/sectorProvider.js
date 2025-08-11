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
exports.SectorProvider = void 0;
const vscode = __importStar(require("vscode"));
class SectorProvider {
    constructor(context, sectorClient) {
        this.context = context;
        this.sectorClient = sectorClient;
    }
    createProjectsTreeProvider() {
        return {
            getTreeItem: (element) => element,
            getChildren: async () => {
                try {
                    const projects = await this.sectorClient.getProjects();
                    return projects.map(project => new ProjectTreeItem(project));
                }
                catch (error) {
                    return [new ErrorTreeItem('Failed to load projects')];
                }
            }
        };
    }
    createAssistantTreeProvider() {
        return {
            getTreeItem: (element) => element,
            getChildren: () => [
                new CommandTreeItem('Ask AI Assistant', 'sector.showAssistant'),
                new CommandTreeItem('Analyze Context', 'sector.analyzeContext')
            ]
        };
    }
    createVisualizationsTreeProvider() {
        return {
            getTreeItem: (element) => element,
            getChildren: () => [
                new CommandTreeItem('Visualize Code', 'sector.visualizeCode'),
                new CommandTreeItem('Export Visualization', 'sector.exportVisualization')
            ]
        };
    }
}
exports.SectorProvider = SectorProvider;
class ProjectTreeItem extends vscode.TreeItem {
    constructor(project) {
        super(project.name, vscode.TreeItemCollapsibleState.None);
        this.tooltip = project.description || 'No description';
        this.description = project.visibility;
        this.iconPath = new vscode.ThemeIcon('folder');
    }
}
class CommandTreeItem extends vscode.TreeItem {
    constructor(label, command) {
        super(label, vscode.TreeItemCollapsibleState.None);
        this.command = { command, title: label };
        this.iconPath = new vscode.ThemeIcon('command');
    }
}
class ErrorTreeItem extends vscode.TreeItem {
    constructor(message) {
        super(message, vscode.TreeItemCollapsibleState.None);
        this.iconPath = new vscode.ThemeIcon('error');
    }
}
//# sourceMappingURL=sectorProvider.js.map