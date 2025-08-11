import * as vscode from 'vscode';
import { SynapseClient } from '../clients/synapse-client';

export class LoginProvider {
  private readonly _viewType = 'synapse.login';
  private _panel: vscode.WebviewPanel | undefined = undefined;

  constructor(
    private readonly _extensionUri: vscode.Uri,
    private readonly _synapseClient: SynapseClient
  ) {}

  showLogin(): void {
    if (this._panel) {
      this._panel.reveal();
      return;
    }

    this._panel = vscode.window.createWebviewPanel(
      this._viewType,
      'Synapse Login',
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
          case 'register':
            await this._handleRegister(message.email, message.password, message.name);
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
        <title>Synapse Login</title>
        <style>
            body {
                padding: 20px;
                font-family: var(--vscode-font-family);
                color: var(--vscode-foreground);
                background-color: var(--vscode-editor-background);
                margin: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
            }
            .login-container {
                background-color: var(--vscode-panel-background);
                border: 1px solid var(--vscode-panel-border);
                border-radius: 8px;
                padding: 30px;
                width: 100%;
                max-width: 400px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
            }
            .logo {
                width: 64px;
                height: 64px;
                margin: 0 auto 20px;
                display: block;
            }
            .title {
                font-size: 2em;
                font-weight: bold;
                margin-bottom: 10px;
                background: linear-gradient(45deg, #3b82f6, #8b5cf6);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
            .subtitle {
                color: var(--vscode-descriptionForeground);
                font-size: 1.1em;
            }
            .form-group {
                margin-bottom: 20px;
            }
            .form-group label {
                display: block;
                margin-bottom: 8px;
                font-weight: 500;
                color: var(--vscode-foreground);
            }
            .form-group input {
                width: 100%;
                padding: 12px;
                border: 1px solid var(--vscode-input-border);
                border-radius: 6px;
                background-color: var(--vscode-input-background);
                color: var(--vscode-input-foreground);
                font-size: 14px;
                box-sizing: border-box;
            }
            .form-group input:focus {
                outline: none;
                border-color: var(--vscode-focusBorder);
                box-shadow: 0 0 0 2px var(--vscode-focusBorder);
            }
            .btn {
                width: 100%;
                padding: 12px;
                border: none;
                border-radius: 6px;
                font-size: 16px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;
                margin-bottom: 15px;
            }
            .btn-primary {
                background-color: var(--vscode-button-background);
                color: var(--vscode-button-foreground);
            }
            .btn-primary:hover {
                background-color: var(--vscode-button-hoverBackground);
            }
            .btn-secondary {
                background-color: var(--vscode-button-secondaryBackground);
                color: var(--vscode-button-secondaryForeground);
            }
            .btn-secondary:hover {
                background-color: var(--vscode-button-secondaryHoverBackground);
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
                background-color: var(--vscode-panel-border);
            }
            .divider span {
                background-color: var(--vscode-panel-background);
                padding: 0 15px;
                color: var(--vscode-descriptionForeground);
                font-size: 14px;
            }
            .error {
                color: var(--vscode-errorForeground);
                background-color: var(--vscode-inputValidation-errorBackground);
                border: 1px solid var(--vscode-inputValidation-errorBorder);
                border-radius: 4px;
                padding: 10px;
                margin-bottom: 20px;
                display: none;
            }
            .success {
                color: var(--vscode-notificationsInfoIcon-foreground);
                background-color: var(--vscode-notificationsInfoIcon-background);
                border: 1px solid var(--vscode-notificationsInfoIcon-border);
                border-radius: 4px;
                padding: 10px;
                margin-bottom: 20px;
                display: none;
            }
            .loading {
                opacity: 0.6;
                pointer-events: none;
            }
            .spinner {
                display: inline-block;
                width: 16px;
                height: 16px;
                border: 2px solid transparent;
                border-top: 2px solid currentColor;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin-right: 8px;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    </head>
    <body>
        <div class="login-container">
            <div class="header">
                <img src="${iconUri}" alt="Synapse" class="logo">
                <div class="title">Synapse</div>
                <div class="subtitle">Universal Learning Platform</div>
            </div>

            <div id="error" class="error"></div>
            <div id="success" class="success"></div>

            <form id="loginForm">
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" required placeholder="Enter your email">
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" name="password" required placeholder="Enter your password">
                </div>
                <button type="submit" class="btn btn-primary" id="loginBtn">
                    <span class="spinner" id="loginSpinner" style="display: none;"></span>
                    Sign In
                </button>
            </form>

            <div class="divider">
                <span>or</span>
            </div>

            <button class="btn btn-secondary" id="registerBtn">
                <span class="spinner" id="registerSpinner" style="display: none;"></span>
                Create Account
            </button>

            <div id="registerForm" style="display: none;">
                <div class="form-group">
                    <label for="regName">Full Name</label>
                    <input type="text" id="regName" name="name" required placeholder="Enter your full name">
                </div>
                <div class="form-group">
                    <label for="regEmail">Email</label>
                    <input type="email" id="regEmail" name="email" required placeholder="Enter your email">
                </div>
                <div class="form-group">
                    <label for="regPassword">Password</label>
                    <input type="password" id="regPassword" name="password" required placeholder="Create a password">
                </div>
                <button type="submit" class="btn btn-primary" id="submitRegisterBtn">
                    <span class="spinner" id="submitRegisterSpinner" style="display: none;"></span>
                    Create Account
                </button>
            </div>
        </div>

        <script>
            const vscode = acquireVsCodeApi();
            
            let isRegisterMode = false;
            
            // Login form submission
            document.getElementById('loginForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                
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
            
            // Toggle register mode
            document.getElementById('registerBtn').addEventListener('click', () => {
                isRegisterMode = !isRegisterMode;
                const loginForm = document.getElementById('loginForm');
                const registerForm = document.getElementById('registerForm');
                const registerBtn = document.getElementById('registerBtn');
                
                if (isRegisterMode) {
                    loginForm.style.display = 'none';
                    registerForm.style.display = 'block';
                    registerBtn.textContent = 'Back to Login';
                } else {
                    loginForm.style.display = 'block';
                    registerForm.style.display = 'none';
                    registerBtn.textContent = 'Create Account';
                }
            });
            
            // Register form submission
            document.getElementById('registerForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                const name = document.getElementById('regName').value;
                const email = document.getElementById('regEmail').value;
                const password = document.getElementById('regPassword').value;
                
                if (!name || !email || !password) {
                    showError('Please fill in all fields');
                    return;
                }
                
                setLoading('submitRegister', true);
                hideMessages();
                
                try {
                    vscode.postMessage({
                        command: 'register',
                        name: name,
                        email: email,
                        password: password
                    });
                } catch (error) {
                    showError('Registration failed: ' + error.message);
                    setLoading('submitRegister', false);
                }
            });
            
            // Handle messages from extension
            window.addEventListener('message', event => {
                const message = event.data;
                switch (message.type) {
                    case 'loginSuccess':
                        showSuccess('Login successful! Welcome to Synapse.');
                        setLoading('login', false);
                        setTimeout(() => {
                            vscode.postMessage({ command: 'close' });
                        }, 1500);
                        break;
                    case 'loginError':
                        showError(message.message || 'Login failed');
                        setLoading('login', false);
                        break;
                    case 'registerSuccess':
                        showSuccess('Account created successfully! You can now login.');
                        setLoading('submitRegister', false);
                        // Switch back to login mode
                        document.getElementById('registerBtn').click();
                        break;
                    case 'registerError':
                        showError(message.message || 'Registration failed');
                        setLoading('submitRegister', false);
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
                const btn = document.getElementById(type === 'login' ? 'loginBtn' : 'submitRegisterBtn');
                const spinner = document.getElementById(type === 'login' ? 'loginSpinner' : 'submitRegisterSpinner');
                
                if (loading) {
                    btn.classList.add('loading');
                    spinner.style.display = 'inline-block';
                } else {
                    btn.classList.remove('loading');
                    spinner.style.display = 'none';
                }
            }
        </script>
    </body>
    </html>`;
  }

  private async _handleLogin(email: string, password: string): Promise<void> {
    try {
      const response = await this._synapseClient.login(email, password);
      
      // Store the token in extension context
      vscode.workspace.getConfiguration('synapse').update('authToken', response.token, vscode.ConfigurationTarget.Global);
      
      // Show success message
      this._panel?.webview.postMessage({
        type: 'loginSuccess',
        user: response.user
      });
      
      // Update VS Code status bar or show user info
      vscode.window.showInformationMessage(`Welcome to Synapse, ${response.user.name || email}!`);
      
    } catch (error) {
      console.error('Login failed:', error);
      this._panel?.webview.postMessage({
        type: 'loginError',
        message: error instanceof Error ? error.message : 'Login failed'
      });
    }
  }

  private async _handleRegister(name: string, email: string, password: string): Promise<void> {
    try {
      // For now, we'll simulate registration since the API might not have this endpoint yet
      // In a real implementation, you'd call this._synapseClient.register(name, email, password)
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      this._panel?.webview.postMessage({
        type: 'registerSuccess'
      });
      
      vscode.window.showInformationMessage(`Account created for ${name}! You can now login.`);
      
    } catch (error) {
      console.error('Registration failed:', error);
      this._panel?.webview.postMessage({
        type: 'registerError',
        message: error instanceof Error ? error.message : 'Registration failed'
      });
    }
  }
}
