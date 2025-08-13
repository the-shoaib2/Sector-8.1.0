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
exports.AuthService = void 0;
const vscode = __importStar(require("vscode"));
const synapse_client_1 = require("../clients/synapse-client");
class AuthService {
    client;
    authState = {
        isAuthenticated: false,
        user: null,
        token: null
    };
    statusBarItem;
    context;
    constructor(context) {
        this.context = context;
        this.client = new synapse_client_1.SectorClient();
        this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
        this.loadStoredAuth();
        this.updateStatusBar();
    }
    loadStoredAuth() {
        // Load stored authentication from VS Code's global state
        try {
            const storedToken = this.context.globalState.get('synapse.authToken');
            const storedUser = this.context.globalState.get('synapse.user');
            if (storedToken && storedUser && this.isValidUser(storedUser)) {
                this.authState.token = storedToken;
                this.authState.user = storedUser;
                this.authState.isAuthenticated = true;
                this.client.setToken(storedToken);
            }
        }
        catch (error) {
            console.error('Failed to load stored auth:', error);
        }
    }
    isValidUser(user) {
        return user &&
            typeof user.id === 'string' &&
            typeof user.name === 'string' &&
            typeof user.email === 'string' &&
            typeof user.role === 'string' &&
            typeof user.isActive === 'boolean';
    }
    async storeAuth(token, user) {
        try {
            await this.context.globalState.update('synapse.authToken', token);
            await this.context.globalState.update('synapse.user', user);
        }
        catch (error) {
            console.error('Failed to store auth:', error);
        }
    }
    async clearStoredAuth() {
        try {
            await this.context.globalState.update('synapse.authToken', undefined);
            await this.context.globalState.update('synapse.user', undefined);
        }
        catch (error) {
            console.error('Failed to clear stored auth:', error);
        }
    }
    updateStatusBar() {
        if (this.authState.isAuthenticated && this.authState.user) {
            this.statusBarItem.text = `$(account) ${this.authState.user.name}`;
            this.statusBarItem.tooltip = `Logged in as ${this.authState.user.email}`;
            this.statusBarItem.command = 'synapse.logout';
            this.statusBarItem.show();
        }
        else {
            this.statusBarItem.text = '$(sign-in) Sign In';
            this.statusBarItem.tooltip = 'Sign in to Synapse';
            this.statusBarItem.command = 'synapse.login';
            this.statusBarItem.show();
        }
    }
    async login() {
        try {
            // Show login options
            const loginMethod = await vscode.window.showQuickPick(['Email & Password', 'Google', 'GitHub'], { placeHolder: 'Choose login method' });
            if (!loginMethod)
                return false;
            if (loginMethod === 'Email & Password') {
                return await this.loginWithCredentials();
            }
            else {
                return await this.loginWithOAuth(loginMethod.toLowerCase());
            }
        }
        catch (error) {
            vscode.window.showErrorMessage(`Login failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
            return false;
        }
    }
    async loginWithCredentials() {
        const email = await vscode.window.showInputBox({
            placeHolder: 'Enter your email',
            prompt: 'Email address',
            validateInput: (value) => {
                if (!value || !value.includes('@')) {
                    return 'Please enter a valid email address';
                }
                return null;
            }
        });
        if (!email)
            return false;
        const password = await vscode.window.showInputBox({
            placeHolder: 'Enter your password',
            prompt: 'Password',
            password: true,
            validateInput: (value) => {
                if (!value || value.length < 1) {
                    return 'Please enter your password';
                }
                return null;
            }
        });
        if (!password)
            return false;
        try {
            return await vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: 'Signing in...',
                cancellable: false
            }, async () => {
                const response = await this.client.login(email, password);
                if (response.token && response.user) {
                    this.authState.token = response.token;
                    this.authState.user = response.user;
                    this.authState.isAuthenticated = true;
                    this.client.setToken(response.token);
                    await this.storeAuth(response.token, response.user);
                    this.updateStatusBar();
                    vscode.window.showInformationMessage(`Welcome back, ${response.user.name}!`);
                    return true;
                }
                return false;
            });
        }
        catch (error) {
            vscode.window.showErrorMessage(`Login failed: ${error instanceof Error ? error.message : 'Invalid credentials'}`);
            return false;
        }
    }
    async loginWithOAuth(provider) {
        try {
            const authUrl = await this.client.loginWithOAuth(provider);
            // Open the OAuth URL in the user's default browser
            await vscode.env.openExternal(vscode.Uri.parse(authUrl));
            vscode.window.showInformationMessage(`Please complete the ${provider} login in your browser. You'll be redirected back to VS Code.`);
            // For OAuth, we'll need to implement a callback mechanism
            // For now, we'll show a message and let the user manually refresh
            return false;
        }
        catch (error) {
            vscode.window.showErrorMessage(`OAuth login failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
            return false;
        }
    }
    async logout() {
        try {
            if (this.authState.isAuthenticated) {
                await this.client.logout();
            }
        }
        catch (error) {
            console.error('Logout error:', error);
        }
        finally {
            this.authState.token = null;
            this.authState.user = null;
            this.authState.isAuthenticated = false;
            this.client.clearToken();
            await this.clearStoredAuth();
            this.updateStatusBar();
            vscode.window.showInformationMessage('You have been signed out');
        }
    }
    async refreshAuth() {
        try {
            if (!this.authState.token)
                return false;
            const user = await this.client.getCurrentUser();
            if (user) {
                this.authState.user = user;
                this.updateStatusBar();
                return true;
            }
        }
        catch (error) {
            console.error('Auth refresh failed:', error);
            await this.logout();
        }
        return false;
    }
    getAuthState() {
        return { ...this.authState };
    }
    isAuthenticated() {
        return this.authState.isAuthenticated;
    }
    getUser() {
        return this.authState.user;
    }
    getClient() {
        return this.client;
    }
    dispose() {
        this.statusBarItem.dispose();
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth-service.js.map