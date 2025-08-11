import * as vscode from 'vscode';
import { SectorClient } from '../clients/synapse-client';
export declare class SectorProvider implements vscode.WebviewViewProvider {
    private readonly synapseClient;
    static readonly viewType = "synapse.projects";
    constructor(synapseClient: SectorClient);
    resolveWebviewView(webviewView: vscode.WebviewView, context: vscode.WebviewViewResolveContext, _token: vscode.CancellationToken): void;
    private _getHtmlForWebview;
    private _updateProjects;
}
//# sourceMappingURL=synapse-provider.d.ts.map