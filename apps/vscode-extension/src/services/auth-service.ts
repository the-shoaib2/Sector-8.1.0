import * as vscode from 'vscode';
import { SectorClient } from '../clients/synapse-client';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  image?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

export class AuthService {
  private client: SectorClient;
  private authState: AuthState = {
    isAuthenticated: false,
    user: null,
    token: null
  };
  private statusBarItem: vscode.StatusBarItem;
  private context: vscode.ExtensionContext;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
    this.client = new SectorClient();
    this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
    this.loadStoredAuth();
    this.updateStatusBar();
  }

  private loadStoredAuth(): void {
    // Load stored authentication from VS Code's global state
    try {
      const storedToken = this.context.globalState.get('synapse.authToken') as string | undefined;
      const storedUser = this.context.globalState.get('synapse.user') as User | undefined;
      
      if (storedToken && storedUser && this.isValidUser(storedUser)) {
        this.authState.token = storedToken;
        this.authState.user = storedUser;
        this.authState.isAuthenticated = true;
        this.client.setToken(storedToken);
      }
    } catch (error) {
      console.error('Failed to load stored auth:', error);
    }
  }

  private isValidUser(user: any): user is User {
    return user && 
           typeof user.id === 'string' && 
           typeof user.name === 'string' && 
           typeof user.email === 'string' && 
           typeof user.role === 'string' && 
           typeof user.isActive === 'boolean';
  }

  private async storeAuth(token: string, user: User): Promise<void> {
    try {
      await this.context.globalState.update('synapse.authToken', token);
      await this.context.globalState.update('synapse.user', user);
    } catch (error) {
      console.error('Failed to store auth:', error);
    }
  }

  private async clearStoredAuth(): Promise<void> {
    try {
      await this.context.globalState.update('synapse.authToken', undefined);
      await this.context.globalState.update('synapse.user', undefined);
    } catch (error) {
      console.error('Failed to clear stored auth:', error);
    }
  }

  private updateStatusBar(): void {
    if (this.authState.isAuthenticated && this.authState.user) {
      this.statusBarItem.text = `$(account) ${this.authState.user.name}`;
      this.statusBarItem.tooltip = `Logged in as ${this.authState.user.email}`;
      this.statusBarItem.command = 'synapse.logout';
      this.statusBarItem.show();
    } else {
      this.statusBarItem.text = '$(sign-in) Sign In';
      this.statusBarItem.tooltip = 'Sign in to Synapse';
      this.statusBarItem.command = 'synapse.login';
      this.statusBarItem.show();
    }
  }

  async login(): Promise<boolean> {
    try {
      // Show login options
      const loginMethod = await vscode.window.showQuickPick(
        ['Email & Password', 'Google', 'GitHub'],
        { placeHolder: 'Choose login method' }
      );

      if (!loginMethod) return false;

      if (loginMethod === 'Email & Password') {
        return await this.loginWithCredentials();
      } else {
        return await this.loginWithOAuth(loginMethod.toLowerCase() as 'google' | 'github');
      }
    } catch (error) {
      vscode.window.showErrorMessage(`Login failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return false;
    }
  }

  private async loginWithCredentials(): Promise<boolean> {
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

    if (!email) return false;

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

    if (!password) return false;

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
    } catch (error) {
      vscode.window.showErrorMessage(`Login failed: ${error instanceof Error ? error.message : 'Invalid credentials'}`);
      return false;
    }
  }

  private async loginWithOAuth(provider: 'google' | 'github'): Promise<boolean> {
    try {
      const authUrl = await this.client.loginWithOAuth(provider);
      
      // Open the OAuth URL in the user's default browser
      await vscode.env.openExternal(vscode.Uri.parse(authUrl));
      
      vscode.window.showInformationMessage(
        `Please complete the ${provider} login in your browser. You'll be redirected back to VS Code.`
      );

      // For OAuth, we'll need to implement a callback mechanism
      // For now, we'll show a message and let the user manually refresh
      return false;
    } catch (error) {
      vscode.window.showErrorMessage(`OAuth login failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return false;
    }
  }

  async logout(): Promise<void> {
    try {
      if (this.authState.isAuthenticated) {
        await this.client.logout();
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.authState.token = null;
      this.authState.user = null;
      this.authState.isAuthenticated = false;
      this.client.clearToken();
      await this.clearStoredAuth();
      this.updateStatusBar();
      
      vscode.window.showInformationMessage('You have been signed out');
    }
  }

  async refreshAuth(): Promise<boolean> {
    try {
      if (!this.authState.token) return false;
      
      const user = await this.client.getCurrentUser();
      if (user) {
        this.authState.user = user;
        this.updateStatusBar();
        return true;
      }
    } catch (error) {
      console.error('Auth refresh failed:', error);
      await this.logout();
    }
    return false;
  }

  getAuthState(): AuthState {
    return { ...this.authState };
  }

  isAuthenticated(): boolean {
    return this.authState.isAuthenticated;
  }

  getUser(): User | null {
    return this.authState.user;
  }

  getClient(): SectorClient {
    return this.client;
  }

  dispose(): void {
    this.statusBarItem.dispose();
  }
}
