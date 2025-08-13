import * as vscode from 'vscode';
import { AuthService } from '../services/auth-service';
export declare class SectorProvider implements vscode.WebviewViewProvider {
    private readonly context;
    private readonly authService;
    static readonly viewType = "synapse.projects";
    constructor(context: vscode.ExtensionContext, authService: AuthService);
    resolveWebviewView(webviewView: vscode.WebviewView, context: vscode.WebviewViewResolveContext, _token: vscode.CancellationToken): void;
    private _updateProjects;
    private _getHtmlForWebview;
    dispose(): void;
}
//# sourceMappingURL=synapse-provider.d.ts.map