import * as vscode from 'vscode';
import { SectorClient } from './sectorClient';
export declare class SectorWebviewProvider {
    private context;
    private sectorClient;
    constructor(context: vscode.ExtensionContext, sectorClient: SectorClient);
    showVisualization(visualization: any): void;
    private getVisualizationHtml;
}
//# sourceMappingURL=webviewProvider.d.ts.map