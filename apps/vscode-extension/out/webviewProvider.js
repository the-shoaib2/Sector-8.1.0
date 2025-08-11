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
exports.SectorWebviewProvider = void 0;
const vscode = __importStar(require("vscode"));
class SectorWebviewProvider {
    constructor(context, sectorClient) {
        this.context = context;
        this.sectorClient = sectorClient;
    }
    showVisualization(visualization) {
        const panel = vscode.window.createWebviewPanel('sector.visualization', `Visualization: ${visualization.name}`, vscode.ViewColumn.One, {
            enableScripts: true,
            retainContextWhenHidden: true
        });
        panel.webview.html = this.getVisualizationHtml(visualization);
    }
    getVisualizationHtml(visualization) {
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${visualization.name}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background: var(--vscode-editor-background);
            color: var(--vscode-editor-foreground);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .visualization {
            border: 1px solid var(--vscode-panel-border);
            border-radius: 8px;
            padding: 20px;
            background: var(--vscode-panel-background);
        }
        .info {
            margin-bottom: 20px;
        }
        .info-item {
            margin: 10px 0;
            padding: 10px;
            background: var(--vscode-editor-inactiveSelectionBackground);
            border-radius: 4px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>${visualization.name}</h1>
        <p>Type: ${visualization.type}</p>
    </div>
    
    <div class="visualization">
        <div class="info">
            <h3>Visualization Information</h3>
            <div class="info-item">
                <strong>Name:</strong> ${visualization.name}
            </div>
            <div class="info-item">
                <strong>Type:</strong> ${visualization.type}
            </div>
            <div class="info-item">
                <strong>Created:</strong> ${new Date(visualization.createdAt).toLocaleString()}
            </div>
            ${visualization.description ? `<div class="info-item"><strong>Description:</strong> ${visualization.description}</div>` : ''}
        </div>
        
        <div id="visualization-content">
            <p>Visualization content will be rendered here.</p>
            <p>This is a placeholder for the actual visualization.</p>
        </div>
    </div>
    
    <script>
        // Add any interactive visualization logic here
        console.log('Visualization loaded:', ${JSON.stringify(visualization)});
    </script>
</body>
</html>
        `;
    }
}
exports.SectorWebviewProvider = SectorWebviewProvider;
//# sourceMappingURL=webviewProvider.js.map