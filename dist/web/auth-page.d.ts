import * as vscode from 'vscode';
export declare class AuthPage {
    private readonly _extensionUri;
    private readonly _synapseClient;
    private readonly _viewType;
    private _panel;
    constructor(_extensionUri: vscode.Uri, _synapseClient: any);
    showAuth(): void;
    private _getHtmlForWebview;
    private _handleLogin;
    private _handleSignup;
    private _handleOAuth;
    private _handleRedirect;
}
//# sourceMappingURL=auth-page.d.ts.map