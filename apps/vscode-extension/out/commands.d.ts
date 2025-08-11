import * as vscode from 'vscode';
import { SectorClient } from './sectorClient';
export declare class SectorCommands {
    private context;
    private sectorClient;
    constructor(context: vscode.ExtensionContext, sectorClient: SectorClient);
    login(): Promise<void>;
    logout(): Promise<void>;
    showAssistant(): Promise<void>;
    visualizeCode(): Promise<void>;
    analyzeContext(): Promise<void>;
    exportVisualization(): Promise<void>;
}
//# sourceMappingURL=commands.d.ts.map