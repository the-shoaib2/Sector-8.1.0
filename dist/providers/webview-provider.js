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
    _extensionUri;
    _synapseClient;
    _viewType = 'synapse.webview';
    _panel = undefined;
    constructor(_extensionUri, _synapseClient) {
        this._extensionUri = _extensionUri;
        this._synapseClient = _synapseClient;
    }
    showAssistant() {
        this._showWebview('Synapse AI Assistant', 'assistant');
    }
    showVisualization(uri) {
        this._showWebview('Code Visualization', 'visualization', { uri: uri.toString() });
    }
    showContextAnalysis(uri) {
        this._showWebview('Context Analysis', 'context', { uri: uri.toString() });
    }
    _showWebview(title, type, data) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;
        if (this._panel) {
            this._panel.reveal(column);
            this._panel.webview.postMessage({ type: 'update', data });
            return;
        }
        this._panel = vscode.window.createWebviewPanel(this._viewType, title, column || vscode.ViewColumn.One, {
            enableScripts: true,
            localResourceRoots: [
                vscode.Uri.joinPath(this._extensionUri, 'media'),
                vscode.Uri.joinPath(this._extensionUri, 'out/compiled'),
            ],
        });
        this._panel.webview.html = this._getHtmlForWebview(this._panel.webview, type, data);
        this._panel.webview.onDidReceiveMessage(message => {
            switch (message.command) {
                case 'sendPrompt':
                    this._handleSendPrompt(message.data);
                    break;
                case 'executeCode':
                    this._handleExecuteCode(message.data);
                    break;
                case 'analyzeContext':
                    this._handleAnalyzeContext(message.data);
                    break;
                case 'createVisualization':
                    this._handleCreateVisualization(message.data);
                    break;
            }
        });
        this._panel.onDidDispose(() => {
            this._panel = undefined;
        });
    }
    _getHtmlForWebview(webview, type, data) {
        const baseHtml = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Synapse - ${type}</title>
        <style>
            body {
                padding: 20px;
                font-family: var(--vscode-font-family);
                color: var(--vscode-foreground);
                background-color: var(--vscode-editor-background);
            }
            .container {
                max-width: 800px;
                margin: 0 auto;
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
            }
            .title {
                font-size: 2em;
                font-weight: bold;
                margin-bottom: 10px;
                background: linear-gradient(45deg, #3b82f6, #8b5cf6);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
            .input-group {
                margin-bottom: 20px;
            }
            .input-group label {
                display: block;
                margin-bottom: 5px;
                font-weight: bold;
            }
            .input-group input, .input-group textarea {
                width: 100%;
                padding: 10px;
                border: 1px solid var(--vscode-input-border);
                border-radius: 4px;
                background-color: var(--vscode-input-background);
                color: var(--vscode-input-foreground);
                font-family: var(--vscode-font-family);
            }
            .input-group textarea {
                min-height: 100px;
                resize: vertical;
            }
            .button {
                background-color: var(--vscode-button-background);
                color: var(--vscode-button-foreground);
                border: none;
                padding: 10px 20px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                margin-right: 10px;
            }
            .button:hover {
                background-color: var(--vscode-button-hoverBackground);
            }
            .button.secondary {
                background-color: var(--vscode-button-secondaryBackground);
                color: var(--vscode-button-secondaryForeground);
            }
            .button.secondary:hover {
                background-color: var(--vscode-button-secondaryHoverBackground);
            }
            .output {
                margin-top: 20px;
                padding: 15px;
                border: 1px solid var(--vscode-panel-border);
                border-radius: 4px;
                background-color: var(--vscode-editor-background);
                min-height: 100px;
            }
            .loading {
                text-align: center;
                color: var(--vscode-descriptionForeground);
                font-style: italic;
            }
            .error {
                color: var(--vscode-errorForeground);
                padding: 10px;
                border: 1px solid var(--vscode-errorForeground);
                border-radius: 4px;
                margin: 10px 0;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="title">Synapse</div>
                <p>Universal Learning Platform</p>
            </div>`;
        let contentHtml = '';
        switch (type) {
            case 'assistant':
                contentHtml = this._getAssistantHtml();
                break;
            case 'visualization':
                contentHtml = this._getVisualizationHtml(data);
                break;
            case 'context':
                contentHtml = this._getContextAnalysisHtml(data);
                break;
            default:
                contentHtml = '<p>Unknown view type</p>';
        }
        const footerHtml = `
        </div>
        <script>
            const vscode = acquireVsCodeApi();
            
            function sendPrompt() {
                const message = document.getElementById('promptMessage').value;
                if (!message.trim()) {
                    alert('Please enter a message');
                    return;
                }
                
                vscode.postMessage({
                    command: 'sendPrompt',
                    data: { message: message.trim() }
                });
                
                document.getElementById('output').innerHTML = '<div class="loading">Processing...</div>';
            }
            
            function executeCode() {
                const language = document.getElementById('language').value;
                const entryPoint = document.getElementById('entryPoint').value;
                const args = document.getElementById('args').value;
                
                if (!language || !entryPoint) {
                    alert('Please fill in all required fields');
                    return;
                }
                
                vscode.postMessage({
                    command: 'executeCode',
                    data: { 
                        language: language.trim(), 
                        entryPoint: entryPoint.trim(),
                        args: args.trim() ? args.trim().split(' ') : []
                    }
                });
                
                document.getElementById('output').innerHTML = '<div class="loading">Executing code...</div>';
            }
            
            function analyzeContext() {
                const query = document.getElementById('contextQuery').value;
                if (!query.trim()) {
                    alert('Please enter a query');
                    return;
                }
                
                vscode.postMessage({
                    command: 'analyzeContext',
                    data: { query: query.trim() }
                });
                
                document.getElementById('output').innerHTML = '<div class="loading">Analyzing context...</div>';
            }
            
            // Handle messages from extension
            window.addEventListener('message', event => {
                const message = event.data;
                switch (message.type) {
                    case 'update':
                        // Handle data updates
                        break;
                    case 'response':
                        document.getElementById('output').innerHTML = '<pre>' + JSON.stringify(message.data, null, 2) + '</pre>';
                        break;
                    case 'error':
                        document.getElementById('output').innerHTML = '<div class="error">' + message.message + '</div>';
                        break;
                }
            });
        </script>
    </body>
    </html>`;
        return baseHtml + contentHtml + footerHtml;
    }
    _getAssistantHtml() {
        return `
        <div class="input-group">
            <label for="promptMessage">Ask me anything about programming, AI, or learning:</label>
            <textarea id="promptMessage" placeholder="e.g., Explain how neural networks work, or help me debug this code..."></textarea>
        </div>
        <button class="button" onclick="sendPrompt()">Send Prompt</button>
        <div id="output" class="output">
            <div class="loading">Ready to help! Ask me anything.</div>
        </div>`;
    }
    _getVisualizationHtml(data) {
        return `
        <div class="input-group">
            <label for="language">Programming Language:</label>
            <input type="text" id="language" placeholder="e.g., python, javascript, java" value="python">
        </div>
        <div class="input-group">
            <label for="entryPoint">Entry Point:</label>
            <input type="text" id="entryPoint" placeholder="e.g., main.py, index.js" value="main.py">
        </div>
        <div class="input-group">
            <label for="args">Arguments (space-separated):</label>
            <input type="text" id="args" placeholder="e.g., arg1 arg2 arg3">
        </div>
        <button class="button" onclick="executeCode()">Execute & Visualize</button>
        <div id="output" class="output">
            <div class="loading">Ready to execute and visualize code.</div>
        </div>`;
    }
    _getContextAnalysisHtml(data) {
        return `
        <div class="input-group">
            <label for="contextQuery">Ask about your uploaded documents:</label>
            <textarea id="contextQuery" placeholder="e.g., What are the main concepts in this document? How does this relate to machine learning?"></textarea>
        </div>
        <button class="button" onclick="analyzeContext()">Analyze Context</button>
        <div id="output" class="output">
            <div class="loading">Ready to analyze your documents.</div>
        </div>`;
    }
    async _handleSendPrompt(data) {
        try {
            const response = await this._synapseClient.sendPrompt(data);
            this._panel?.webview.postMessage({ type: 'response', data: response });
        }
        catch (error) {
            this._panel?.webview.postMessage({
                type: 'error',
                message: error instanceof Error ? error.message : 'Failed to send prompt'
            });
        }
    }
    async _handleExecuteCode(data) {
        try {
            // For now, just show a placeholder response
            this._panel?.webview.postMessage({
                type: 'response',
                data: {
                    message: 'Code execution and visualization coming soon!',
                    request: data
                }
            });
        }
        catch (error) {
            this._panel?.webview.postMessage({
                type: 'error',
                message: error instanceof Error ? error.message : 'Failed to execute code'
            });
        }
    }
    async _handleAnalyzeContext(data) {
        try {
            // For now, just show a placeholder response
            this._panel?.webview.postMessage({
                type: 'response',
                data: {
                    message: 'Context analysis coming soon!',
                    request: data
                }
            });
        }
        catch (error) {
            this._panel?.webview.postMessage({
                type: 'error',
                message: error instanceof Error ? error.message : 'Failed to analyze context'
            });
        }
    }
    async _handleCreateVisualization(data) {
        try {
            const response = await this._synapseClient.createVisualization(data);
            this._panel?.webview.postMessage({ type: 'response', data: response });
        }
        catch (error) {
            this._panel?.webview.postMessage({
                type: 'error',
                message: error instanceof Error ? error.message : 'Failed to create visualization'
            });
        }
    }
}
exports.WebviewProvider = WebviewProvider;
//# sourceMappingURL=webview-provider.js.map