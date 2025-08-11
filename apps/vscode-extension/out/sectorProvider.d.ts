import * as vscode from 'vscode';
import { SectorClient } from './sectorClient';
export declare class SectorProvider {
    private context;
    private sectorClient;
    constructor(context: vscode.ExtensionContext, sectorClient: SectorClient);
    createProjectsTreeProvider(): vscode.TreeDataProvider<any>;
    createAssistantTreeProvider(): vscode.TreeDataProvider<any>;
    createVisualizationsTreeProvider(): vscode.TreeDataProvider<any>;
}
//# sourceMappingURL=sectorProvider.d.ts.map