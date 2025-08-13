"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebviewProvider = void 0;
const vscode = __importStar(require("vscode"));
class WebviewProvider {
    context;
    authService;
    constructor(context, authService) {
        this.context = context;
        this.authService = authService;
    }
    showProject(project) {
        const panel = vscode.window.createWebviewPanel('synapseProject', `Project: ${project.name}`, vscode.ViewColumn.One, {
            enableScripts: true,
            retainContextWhenHidden: true
        });
        panel.webview.html = this.getProjectHtml(panel.webview, project);
    }
    showAssistant() {
        const panel = vscode.window.createWebviewPanel('synapseAssistant', 'Synapse AI Assistant', vscode.ViewColumn.Two, {
            enableScripts: true,
            retainContextWhenHidden: true
        });
        panel.webview.html = this.getAssistantHtml(panel.webview);
    }
    showVisualization(visualization) {
        const panel = vscode.window.createWebviewPanel('synapseVisualization', 'Code Visualization', vscode.ViewColumn.Two, {
            enableScripts: true,
            retainContextWhenHidden: true
        });
        panel.webview.html = this.getVisualizationHtml(panel.webview, visualization);
    }
    showAnalysis(analysis) {
        const panel = vscode.window.createWebviewPanel('synapseAnalysis', 'Code Analysis', vscode.ViewColumn.Two, {
            enableScripts: true,
            retainContextWhenHidden: true
        });
        panel.webview.html = this.getAnalysisHtml(panel.webview, analysis);
    }
    getProjectHtml(webview, project) {
        return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${project.name}</title>
        <style>
            body {
                padding: 20px;
                font-family: var(--vscode-font-family);
                color: var(--vscode-foreground);
                background-color: var(--vscode-editor-background);
            }
            .project-header {
                border-bottom: 1px solid var(--vscode-panel-border);
                padding-bottom: 20px;
                margin-bottom: 20px;
            }
            .project-name {
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 10px;
            }
            .project-description {
                color: var(--vscode-descriptionForeground);
                margin-bottom: 10px;
            }
            .project-meta {
                display: flex;
                gap: 20px;
                font-size: 14px;
                color: var(--vscode-descriptionForeground);
            }
            .section {
                margin-bottom: 30px;
            }
            .section-title {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 15px;
                border-bottom: 1px solid var(--vscode-panel-border);
                padding-bottom: 5px;
            }
            .button {
                background-color: var(--vscode-button-background);
                color: var(--vscode-button-foreground);
                border: none;
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
                margin-right: 10px;
                margin-bottom: 10px;
            }
            .button:hover {
                background-color: var(--vscode-button-hoverBackground);
            }
            .button.secondary {
                background-color: var(--vscode-button-secondaryBackground);
                color: var(--vscode-button-secondaryForeground);
            }
        </style>
    </head>
    <body>
        <div class="project-header">
            <div class="project-name">${project.name}</div>
            <div class="project-description">${project.description || 'No description available'}</div>
            <div class="project-meta">
                <span>Created: ${new Date(project.createdAt || Date.now()).toLocaleDateString()}</span>
                <span>Visibility: ${project.visibility || 'Private'}</span>
            </div>
        </div>

        <div class="section">
            <div class="section-title">Quick Actions</div>
            <button class="button" onclick="visualizeCode()">Visualize Code</button>
            <button class="button" onclick="analyzeContext()">Analyze Context</button>
            <button class="button secondary" onclick="exportProject()">Export Project</button>
        </div>

        <div class="section">
            <div class="section-title">Recent Activity</div>
            <div>No recent activity</div>
        </div>

        <script>
            const vscode = acquireVsCodeApi();
            
            function visualizeCode() {
                vscode.postMessage({
                    command: 'visualizeCode'
                });
            }
            
            function analyzeContext() {
                vscode.postMessage({
                    command: 'analyzeContext'
                });
            }
            
            function exportProject() {
                vscode.postMessage({
                    command: 'exportProject'
                });
            }
        </script>
    </body>
    </html>`;
    }
    getAssistantHtml(webview) {
        return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>AI Assistant</title>
        <style>
            body {
                padding: 20px;
                font-family: var(--vscode-font-family);
                color: var(--vscode-foreground);
                background-color: var(--vscode-editor-background);
                height: 100vh;
                display: flex;
                flex-direction: column;
            }
            .chat-container {
                flex: 1;
                display: flex;
                flex-direction: column;
                height: 100%;
            }
            .chat-messages {
                flex: 1;
                overflow-y: auto;
                margin-bottom: 20px;
                padding: 10px;
                border: 1px solid var(--vscode-panel-border);
                border-radius: 4px;
                background-color: var(--vscode-input-background);
            }
            .message {
                margin-bottom: 15px;
                padding: 10px;
                border-radius: 4px;
            }
            .message.user {
                background-color: var(--vscode-button-background);
                color: var(--vscode-button-foreground);
                margin-left: 20%;
            }
            .message.assistant {
                background-color: var(--vscode-input-background);
                border: 1px solid var(--vscode-panel-border);
                margin-right: 20%;
            }
            .input-container {
                display: flex;
                gap: 10px;
            }
            .input-field {
                flex: 1;
                padding: 10px;
                border: 1px solid var(--vscode-panel-border);
                border-radius: 4px;
                background-color: var(--vscode-input-background);
                color: var(--vscode-input-foreground);
                font-family: var(--vscode-font-family);
            }
            .send-button {
                background-color: var(--vscode-button-background);
                color: var(--vscode-button-foreground);
                border: none;
                padding: 10px 20px;
                border-radius: 4px;
                cursor: pointer;
            }
            .send-button:hover {
                background-color: var(--vscode-button-hoverBackground);
            }
        </style>
    </head>
    <body>
        <div class="chat-container">
            <div class="chat-messages" id="chatMessages">
                <div class="message assistant">
                    Hello! I'm your AI coding assistant. How can I help you today?
                </div>
            </div>
            
            <div class="input-container">
                <input type="text" class="input-field" id="messageInput" placeholder="Ask me anything about your code..." />
                <button class="send-button" onclick="sendMessage()">Send</button>
            </div>
        </div>

        <script>
            const vscode = acquireVsCodeApi();
            const messageInput = document.getElementById('messageInput');
            const chatMessages = document.getElementById('chatMessages');

            messageInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    sendMessage();
                }
            });

            function sendMessage() {
                const message = messageInput.value.trim();
                if (!message) return;

                // Add user message
                addMessage(message, 'user');
                messageInput.value = '';

                // Send to extension
                vscode.postMessage({
                    command: 'sendMessage',
                    message: message
                });
            }

            function addMessage(text, sender) {
                const messageDiv = document.createElement('div');
                messageDiv.className = \`message \${sender}\`;
                messageDiv.textContent = text;
                chatMessages.appendChild(messageDiv);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }

            // Handle messages from extension
            window.addEventListener('message', event => {
                const message = event.data;
                if (message.command === 'assistantResponse') {
                    addMessage(message.response, 'assistant');
                }
            });
        </script>
    </body>
    </html>`;
    }
    getVisualizationHtml(webview, visualization) {
        return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Code Visualization</title>
        <style>
            body {
                padding: 20px;
                font-family: var(--vscode-font-family);
                color: var(--vscode-foreground);
                background-color: var(--vscode-editor-background);
            }
            .visualization-container {
                text-align: center;
                padding: 40px;
            }
            .visualization-placeholder {
                border: 2px dashed var(--vscode-panel-border);
                border-radius: 8px;
                padding: 60px 20px;
                color: var(--vscode-descriptionForeground);
            }
            .export-buttons {
                margin-top: 20px;
            }
            .export-button {
                background-color: var(--vscode-button-background);
                color: var(--vscode-button-foreground);
                border: none;
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
                margin: 0 5px;
            }
            .export-button:hover {
                background-color: var(--vscode-button-hoverBackground);
            }
        </style>
    </head>
    <body>
        <div class="visualization-container">
            <div class="visualization-placeholder">
                <h3>Code Visualization</h3>
                <p>Type: ${visualization.type}</p>
                <p>Language: ${visualization.config?.language || 'Unknown'}</p>
                <p>Visualization will be rendered here...</p>
            </div>
            
            <div class="export-buttons">
                <button class="export-button" onclick="exportAs('png')">Export as PNG</button>
                <button class="export-button" onclick="exportAs('svg')">Export as SVG</button>
                <button class="export-button" onclick="exportAs('pdf')">Export as PDF</button>
            </div>
        </div>

        <script>
            const vscode = acquireVsCodeApi();
            
            function exportAs(format) {
                vscode.postMessage({
                    command: 'exportVisualization',
                    format: format
                });
            }
        </script>
    </body>
    </html>`;
    }
    getAnalysisHtml(webview, analysis) {
        return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Code Analysis</title>
        <style>
            body {
                padding: 20px;
                font-family: var(--vscode-font-family);
                color: var(--vscode-foreground);
                background-color: var(--vscode-editor-background);
            }
            .analysis-container {
                max-width: 800px;
                margin: 0 auto;
            }
            .analysis-header {
                border-bottom: 1px solid var(--vscode-panel-border);
                padding-bottom: 20px;
                margin-bottom: 20px;
            }
            .analysis-title {
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 10px;
            }
            .analysis-content {
                line-height: 1.6;
            }
            .analysis-section {
                margin-bottom: 20px;
                padding: 15px;
                border: 1px solid var(--vscode-panel-border);
                border-radius: 4px;
                background-color: var(--vscode-input-background);
            }
            .section-title {
                font-weight: bold;
                margin-bottom: 10px;
                color: var(--vscode-textPreformat-foreground);
            }
        </style>
    </head>
    <body>
        <div class="analysis-container">
            <div class="analysis-header">
                <div class="analysis-title">Code Analysis Results</div>
            </div>
            
            <div class="analysis-content">
                <div class="analysis-section">
                    <div class="section-title">Analysis Summary</div>
                    <div>${analysis.summary || 'Analysis completed successfully'}</div>
                </div>
                
                <div class="analysis-section">
                    <div class="section-title">Key Findings</div>
                    <div>${analysis.findings || 'No specific findings to report'}</div>
                </div>
                
                <div class="analysis-section">
                    <div class="section-title">Recommendations</div>
                    <div>${analysis.recommendations || 'No specific recommendations at this time'}</div>
                </div>
            </div>
        </div>
    </body>
    </html>`;
    }
    dispose() {
        // Clean up any resources if needed
    }
}
exports.WebviewProvider = WebviewProvider;
//# sourceMappingURL=webview-provider.js.map