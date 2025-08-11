import * as vscode from 'vscode';
import { SectorClient } from '../clients/sector-client';
export declare class SectorProvider implements vscode.WebviewViewProvider {
    private readonly synapseClient;
    static readonly viewType = "synapse.projects";
    constructor(synapseClient: SectorClient);
    resolveWebviewView(webviewView: vscode.WebviewView, context: vscode.WebviewViewResolveContext, _token: vscode.CancellationToken): void;
    private _getHtmlForWebview;
    private _updateProjects;
}
//# sourceMappingURL=sector-provider.d.ts.map