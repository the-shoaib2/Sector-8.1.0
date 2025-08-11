import * as vscode from 'vscode';
import { SectorClient } from '../clients/synapse-client';
export declare class LoginProvider {
    private readonly _extensionUri;
    private readonly _synapseClient;
    private readonly _viewType;
    private _panel;
    constructor(_extensionUri: vscode.Uri, _synapseClient: SectorClient);
    showLogin(): void;
    private _getHtmlForWebview;
    private _handleLogin;
    private _handleRegister;
}
//# sourceMappingURL=login-provider.d.ts.map