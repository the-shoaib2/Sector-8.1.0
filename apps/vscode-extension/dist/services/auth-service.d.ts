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
export declare class AuthService {
    private client;
    private authState;
    private statusBarItem;
    private context;
    constructor(context: vscode.ExtensionContext);
    private loadStoredAuth;
    private isValidUser;
    private storeAuth;
    private clearStoredAuth;
    private updateStatusBar;
    login(): Promise<boolean>;
    private loginWithCredentials;
    private loginWithOAuth;
    logout(): Promise<void>;
    refreshAuth(): Promise<boolean>;
    getAuthState(): AuthState;
    isAuthenticated(): boolean;
    getUser(): User | null;
    getClient(): SectorClient;
    dispose(): void;
}
//# sourceMappingURL=auth-service.d.ts.map