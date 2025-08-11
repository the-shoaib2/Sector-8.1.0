import * as vscode from 'vscode';
import { SectorClient } from '../clients/sector-client';
export declare class WebviewProvider {
    private readonly _extensionUri;
    private readonly _synapseClient;
    private readonly _viewType;
    private _panel;
    constructor(_extensionUri: vscode.Uri, _synapseClient: SectorClient);
    showAssistant(): void;
    showVisualization(uri: vscode.Uri): void;
    showContextAnalysis(uri: vscode.Uri): void;
    private _showWebview;
    private _getHtmlForWebview;
    private _getAssistantHtml;
    private _getVisualizationHtml;
    private _getContextAnalysisHtml;
    private _handleSendPrompt;
    private _handleExecuteCode;
    private _handleAnalyzeContext;
    private _handleCreateVisualization;
}
//# sourceMappingURL=webview-provider.d.ts.map