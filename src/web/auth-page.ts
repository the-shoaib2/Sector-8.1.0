import * as vscode from 'vscode';

export class AuthPage {
  private readonly _viewType = 'synapse.auth';
  private _panel: vscode.WebviewPanel | undefined = undefined;

  constructor(
    private readonly _extensionUri: vscode.Uri,
    private readonly _synapseClient: any
  ) {}

  showAuth(): void {
    if (this._panel) {
      this._panel.reveal();
      return;
    }

    this._panel = vscode.window.createWebviewPanel(
      this._viewType,
      'Synapse Authentication',
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        localResourceRoots: [
          vscode.Uri.joinPath(this._extensionUri, 'resources'),
        ],
      }
    );

    this._panel.webview.html = this._getHtmlForWebview(this._panel.webview);

    // Handle messages from the webview
    this._panel.webview.onDidReceiveMessage(
      async message => {
        switch (message.command) {
          case 'login':
            await this._handleLogin(message.email, message.password);
            break;
          case 'signup':
            await this._handleSignup(message.name, message.email, message.password);
            break;
          case 'oauth':
            await this._handleOAuth(message.provider);
            break;
          case 'redirect':
            await this._handleRedirect(message.editor);
            break;
        }
      }
    );

    this._panel.onDidDispose(() => {
      this._panel = undefined;
    });
  }

  private _getHtmlForWebview(webview: vscode.Webview): string {
    const iconUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'resources', 'icon.svg')
    );

    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Synapse Authentication</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background-color: #f5f5f5;
                color: #333;
                line-height: 1.6;
            }
            
            .container {
                max-width: 400px;
                margin: 50px auto;
                padding: 30px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            
            .header {
                text-align: center;
                margin-bottom: 30px;
            }
            
            .logo {
                width: 48px;
                height: 48px;
                margin: 0 auto 15px;
                display: block;
            }
            
            .title {
                font-size: 24px;
                font-weight: 600;
                margin-bottom: 5px;
            }
            
            .subtitle {
                font-size: 14px;
                color: #666;
            }
            
            .form-group {
                margin-bottom: 20px;
            }
            
            .form-group label {
                display: block;
                margin-bottom: 8px;
                font-weight: 500;
                font-size: 14px;
            }
            
            .form-group input {
                width: 100%;
                padding: 12px;
                border: 1px solid #ddd;
                border-radius: 6px;
                font-size: 14px;
                transition: border-color 0.2s;
            }
            
            .form-group input:focus {
                outline: none;
                border-color: #007acc;
            }
            
            .btn {
                width: 100%;
                padding: 12px;
                border: none;
                border-radius: 6px;
                font-size: 16px;
                font-weight: 500;
                cursor: pointer;
                transition: background-color 0.2s;
                margin-bottom: 15px;
            }
            
            .btn-primary {
                background-color: #007acc;
                color: white;
            }
            
            .btn-primary:hover {
                background-color: #005a9e;
            }
            
            .btn-secondary {
                background-color: #f8f9fa;
                color: #333;
                border: 1px solid #ddd;
            }
            
            .btn-secondary:hover {
                background-color: #e9ecef;
            }
            
            .divider {
                text-align: center;
                margin: 20px 0;
                position: relative;
            }
            
            .divider::before {
                content: '';
                position: absolute;
                top: 50%;
                left: 0;
                right: 0;
                height: 1px;
                background-color: #ddd;
            }
            
            .divider span {
                background-color: white;
                padding: 0 15px;
                color: #666;
                font-size: 14px;
            }
            
            .oauth-buttons {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 10px;
                margin-bottom: 20px;
            }
            
            .oauth-btn {
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 6px;
                background: white;
                cursor: pointer;
                font-size: 14px;
                transition: background-color 0.2s;
            }
            
            .oauth-btn:hover {
                background-color: #f8f9fa;
            }
            
            .oauth-btn.github {
                border-color: #24292e;
                color: #24292e;
            }
            
            .oauth-btn.google {
                border-color: #4285f4;
                color: #4285f4;
            }
            
            .tabs {
                display: flex;
                margin-bottom: 20px;
                border-bottom: 1px solid #ddd;
            }
            
            .tab {
                flex: 1;
                padding: 10px;
                text-align: center;
                cursor: pointer;
                border-bottom: 2px solid transparent;
                transition: border-color 0.2s;
            }
            
            .tab.active {
                border-bottom-color: #007acc;
                color: #007acc;
            }
            
            .tab-content {
                display: none;
            }
            
            .tab-content.active {
                display: block;
            }
            
            .redirect-section {
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #ddd;
            }
            
            .redirect-title {
                font-size: 16px;
                font-weight: 500;
                margin-bottom: 15px;
                text-align: center;
            }
            
            .editor-buttons {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 10px;
            }
            
            .editor-btn {
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 6px;
                background: white;
                cursor: pointer;
                font-size: 14px;
                transition: background-color 0.2s;
            }
            
            .editor-btn:hover {
                background-color: #f8f9fa;
            }
            
            .error {
                color: #dc3545;
                background-color: #f8d7da;
                border: 1px solid #f5c6cb;
                border-radius: 4px;
                padding: 10px;
                margin-bottom: 20px;
                display: none;
            }
            
            .success {
                color: #155724;
                background-color: #d4edda;
                border: 1px solid #c3e6cb;
                border-radius: 4px;
                padding: 10px;
                margin-bottom: 20px;
                display: none;
            }
            
            .loading {
                opacity: 0.6;
                pointer-events: none;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <img src="${iconUri}" alt="Synapse" class="logo">
                <div class="title">Synapse</div>
                <div class="subtitle">Learning Platform</div>
            </div>

            <div id="error" class="error"></div>
            <div id="success" class="success"></div>

            <div class="tabs">
                <div class="tab active" onclick="switchTab('login')">Sign In</div>
                <div class="tab" onclick="switchTab('signup')">Create Account</div>
            </div>

            <div id="loginTab" class="tab-content active">
                <form id="loginForm">
                    <div class="form-group">
                        <label for="loginEmail">Email</label>
                        <input type="email" id="loginEmail" required>
                    </div>
                    <div class="form-group">
                        <label for="loginPassword">Password</label>
                        <input type="password" id="loginPassword" required>
                    </div>
                    <button type="submit" class="btn btn-primary" id="loginBtn">Sign In</button>
                </form>

                <div class="divider">
                    <span>or</span>
                </div>

                <div class="oauth-buttons">
                    <button class="oauth-btn github" onclick="oauthLogin('github')">GitHub</button>
                    <button class="oauth-btn google" onclick="oauthLogin('google')">Google</button>
                </div>
            </div>

            <div id="signupTab" class="tab-content">
                <form id="signupForm">
                    <div class="form-group">
                        <label for="signupName">Full Name</label>
                        <input type="text" id="signupName" required>
                    </div>
                    <div class="form-group">
                        <label for="signupEmail">Email</label>
                        <input type="email" id="signupEmail" required>
                    </div>
                    <div class="form-group">
                        <label for="signupPassword">Password</label>
                        <input type="password" id="signupPassword" required>
                    </div>
                    <button type="submit" class="btn btn-primary" id="signupBtn">Create Account</button>
                </form>

                <div class="divider">
                    <span>or</span>
                </div>

                <div class="oauth-buttons">
                    <button class="oauth-btn github" onclick="oauthLogin('github')">GitHub</button>
                    <button class="oauth-btn google" onclick="oauthLogin('google')">Google</button>
                </div>
            </div>

            <div class="redirect-section">
                <div class="redirect-title">Open in Code Editor</div>
                <div class="editor-buttons">
                    <button class="editor-btn" onclick="redirectToEditor('vscode')">VS Code</button>
                    <button class="editor-btn" onclick="redirectToEditor('cursor')">Cursor</button>
                    <button class="editor-btn" onclick="redirectToEditor('windsurf')">Windsurf</button>
                    <button class="editor-btn" onclick="redirectToEditor('tera')">Tera</button>
                </div>
            </div>
        </div>

        <script>
            const vscode = acquireVsCodeApi();
            let currentTab = 'login';
            
            function switchTab(tab) {
                currentTab = tab;
                
                // Update tab styles
                document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                
                event.target.classList.add('active');
                document.getElementById(tab + 'Tab').classList.add('active');
                
                // Clear messages
                hideMessages();
            }
            
            // Login form submission
            document.getElementById('loginForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                const email = document.getElementById('loginEmail').value;
                const password = document.getElementById('loginPassword').value;
                
                if (!email || !password) {
                    showError('Please fill in all fields');
                    return;
                }
                
                setLoading('login', true);
                hideMessages();
                
                try {
                    vscode.postMessage({
                        command: 'login',
                        email: email,
                        password: password
                    });
                } catch (error) {
                    showError('Login failed: ' + error.message);
                    setLoading('login', false);
                }
            });
            
            // Signup form submission
            document.getElementById('signupForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                const name = document.getElementById('signupName').value;
                const email = document.getElementById('signupEmail').value;
                const password = document.getElementById('signupPassword').value;
                
                if (!name || !email || !password) {
                    showError('Please fill in all fields');
                    return;
                }
                
                setLoading('signup', true);
                hideMessages();
                
                try {
                    vscode.postMessage({
                        command: 'signup',
                        name: name,
                        email: email,
                        password: password
                    });
                } catch (error) {
                    showError('Signup failed: ' + error.message);
                    setLoading('signup', false);
                }
            });
            
            function oauthLogin(provider) {
                vscode.postMessage({
                    command: 'oauth',
                    provider: provider
                });
            }
            
            function redirectToEditor(editor) {
                vscode.postMessage({
                    command: 'redirect',
                    editor: editor
                });
            }
            
            // Handle messages from extension
            window.addEventListener('message', event => {
                const message = event.data;
                switch (message.type) {
                    case 'loginSuccess':
                        showSuccess('Login successful! Welcome to Synapse.');
                        setLoading('login', false);
                        break;
                    case 'loginError':
                        showError(message.message || 'Login failed');
                        setLoading('login', false);
                        break;
                    case 'signupSuccess':
                        showSuccess('Account created successfully! You can now login.');
                        setLoading('signup', false);
                        switchTab('login');
                        break;
                    case 'signupError':
                        showError(message.message || 'Signup failed');
                        setLoading('signup', false);
                        break;
                    case 'oauthSuccess':
                        showSuccess('OAuth authentication successful!');
                        break;
                    case 'oauthError':
                        showError(message.message || 'OAuth authentication failed');
                        break;
                }
            });
            
            function showError(message) {
                const errorDiv = document.getElementById('error');
                errorDiv.textContent = message;
                errorDiv.style.display = 'block';
                document.getElementById('success').style.display = 'none';
            }
            
            function showSuccess(message) {
                const successDiv = document.getElementById('success');
                successDiv.textContent = message;
                successDiv.style.display = 'block';
                document.getElementById('error').style.display = 'none';
            }
            
            function hideMessages() {
                document.getElementById('error').style.display = 'none';
                document.getElementById('success').style.display = 'none';
            }
            
            function setLoading(type, loading) {
                const btn = document.getElementById(type + 'Btn');
                if (loading) {
                    btn.classList.add('loading');
                    btn.textContent = type === 'login' ? 'Signing In...' : 'Creating Account...';
                } else {
                    btn.classList.remove('loading');
                    btn.textContent = type === 'login' ? 'Sign In' : 'Create Account';
                }
            }
        </script>
    </body>
    </html>`;
  }

  private async _handleLogin(email: string, password: string): Promise<void> {
    try {
      // For now, simulate login since we don't have the backend yet
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      this._panel?.webview.postMessage({
        type: 'loginSuccess'
      });
      
      vscode.window.showInformationMessage(`Welcome to Synapse, ${email}!`);
      
    } catch (error) {
      console.error('Login failed:', error);
      this._panel?.webview.postMessage({
        type: 'loginError',
        message: error instanceof Error ? error.message : 'Login failed'
      });
    }
  }

  private async _handleSignup(name: string, email: string, password: string): Promise<void> {
    try {
      // For now, simulate signup
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      this._panel?.webview.postMessage({
        type: 'signupSuccess'
      });
      
      vscode.window.showInformationMessage(`Account created for ${name}!`);
      
    } catch (error) {
      console.error('Signup failed:', error);
      this._panel?.webview.postMessage({
        type: 'signupError',
        message: error instanceof Error ? error.message : 'Signup failed'
      });
    }
  }

  private async _handleOAuth(provider: string): Promise<void> {
    try {
      // Simulate OAuth flow
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      this._panel?.webview.postMessage({
        type: 'oauthSuccess'
      });
      
      vscode.window.showInformationMessage(`OAuth authentication with ${provider} successful!`);
      
    } catch (error) {
      console.error('OAuth failed:', error);
      this._panel?.webview.postMessage({
        type: 'oauthError',
        message: error instanceof Error ? error.message : 'OAuth authentication failed'
      });
    }
  }

  private async _handleRedirect(editor: string): Promise<void> {
    try {
      let uri: string;
      
      switch (editor) {
        case 'vscode':
          uri = 'vscode://file/' + vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
          break;
        case 'cursor':
          uri = 'cursor://file/' + vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
          break;
        case 'windsurf':
          uri = 'windsurf://file/' + vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
          break;
        case 'tera':
          uri = 'tera://file/' + vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
          break;
        default:
          throw new Error('Unknown editor');
      }
      
      // Open the URI
      await vscode.env.openExternal(vscode.Uri.parse(uri));
      
      vscode.window.showInformationMessage(`Opening Synapse in ${editor}...`);
      
    } catch (error) {
      console.error('Redirect failed:', error);
      vscode.window.showErrorMessage(`Failed to open in ${editor}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
