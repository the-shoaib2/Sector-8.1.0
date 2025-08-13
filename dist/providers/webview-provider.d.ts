import * as vscode from 'vscode';
import { AuthService } from '../services/auth-service';
export declare class WebviewProvider {
    private readonly context;
    private readonly authService;
    constructor(context: vscode.ExtensionContext, authService: AuthService);
    showProject(project: any): void;
    showAssistant(): void;
    showVisualization(visualization: any): void;
    showAnalysis(analysis: any): void;
    private getProjectHtml;
    private getAssistantHtml;
    private getVisualizationHtml;
    private getAnalysisHtml;
    dispose(): void;
}
//# sourceMappingURL=webview-provider.d.ts.map