import * as http from 'http';
import * as url from 'url';
import * as querystring from 'querystring';

interface AuthRequest {
  email?: string;
  password?: string;
  name?: string;
  provider?: string;
  redirect_uri?: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: any;
  redirect_url?: string;
}

class AuthServer {
  private server: http.Server;
  private port: number;
  private users: Map<string, any> = new Map();
  private tokens: Map<string, string> = new Map();

  constructor(port: number = 3000) {
    this.port = port;
    this.server = http.createServer(this.handleRequest.bind(this));
  }

  start(): void {
    this.server.listen(this.port, () => {
      console.log(`🚀 Synapse Auth Server running on http://localhost:${this.port}`);
      console.log(`📝 Login: http://localhost:${this.port}/login`);
      console.log(`🔐 Signup: http://localhost:${this.port}/signup`);
    });
  }

  private handleRequest(req: http.IncomingMessage, res: http.ServerResponse): void {
    const parsedUrl = url.parse(req.url || '/', true);
    const path = parsedUrl.pathname;

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }

    switch (path) {
      case '/':
        this.serveHomePage(res);
        break;
      case '/login':
        if (req.method === 'GET') {
          this.serveLoginPage(res);
        } else if (req.method === 'POST') {
          this.handleLogin(req, res);
        } else {
          this.methodNotAllowed(res);
        }
        break;
      case '/signup':
        if (req.method === 'GET') {
          this.serveSignupPage(res);
        } else if (req.method === 'POST') {
          this.handleSignup(req, res);
        } else {
          this.methodNotAllowed(res);
        }
        break;
      case '/oauth':
        if (req.method === 'POST') {
          this.handleOAuth(req, res);
        } else {
          this.methodNotAllowed(res);
        }
        break;
      case '/redirect':
        if (req.method === 'GET') {
          this.handleRedirect(req, res);
        } else {
          this.methodNotAllowed(res);
        }
        break;
      default:
        this.notFound(res);
    }
  }

  private serveHomePage(res: http.ServerResponse): void {
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Synapse Learning Platform</title>
          <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5; color: #333; line-height: 1.6; }
              .container { max-width: 800px; margin: 50px auto; padding: 30px; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
              .header { text-align: center; margin-bottom: 30px; }
              .title { font-size: 32px; font-weight: 600; margin-bottom: 10px; }
              .subtitle { font-size: 18px; color: #666; margin-bottom: 30px; }
              .buttons { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
              .btn { padding: 15px; border: none; border-radius: 6px; font-size: 16px; font-weight: 500; cursor: pointer; text-decoration: none; text-align: center; transition: background-color 0.2s; }
              .btn-primary { background-color: #007acc; color: white; }
              .btn-primary:hover { background-color: #005a9e; }
              .btn-secondary { background-color: #f8f9fa; color: #333; border: 1px solid #ddd; }
              .btn-secondary:hover { background-color: #e9ecef; }
              .features { margin-top: 40px; }
              .feature { margin-bottom: 20px; padding: 20px; border: 1px solid #ddd; border-radius: 6px; }
              .feature h3 { margin-bottom: 10px; color: #007acc; }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <div class="title">Synapse Learning Platform</div>
                  <div class="subtitle">Universal Intelligent Learning & Coding Assistant</div>
              </div>
              
              <div class="buttons">
                  <a href="/login" class="btn btn-primary">Sign In</a>
                  <a href="/signup" class="btn btn-secondary">Create Account</a>
              </div>
              
              <div class="features">
                  <div class="feature">
                      <h3>🔐 Secure Authentication</h3>
                      <p>Login with email/password or OAuth providers (GitHub, Google)</p>
                  </div>
                  <div class="feature">
                      <h3>💻 Multi-Editor Support</h3>
                      <p>Open Synapse in VS Code, Cursor, Windsurf, or Tera</p>
                  </div>
                  <div class="feature">
                      <h3>🧠 AI-Powered Learning</h3>
                      <p>Intelligent code analysis, visualization, and assistance</p>
                  </div>
              </div>
          </div>
      </body>
      </html>
    `;
    
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
  }

  private serveLoginPage(res: http.ServerResponse): void {
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Sign In - Synapse</title>
          <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5; color: #333; line-height: 1.6; }
              .container { max-width: 400px; margin: 50px auto; padding: 30px; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
              .header { text-align: center; margin-bottom: 30px; }
              .title { font-size: 24px; font-weight: 600; margin-bottom: 5px; }
              .subtitle { font-size: 14px; color: #666; }
              .form-group { margin-bottom: 20px; }
              .form-group label { display: block; margin-bottom: 8px; font-weight: 500; font-size: 14px; }
              .form-group input { width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; }
              .btn { width: 100%; padding: 12px; border: none; border-radius: 6px; font-size: 16px; font-weight: 500; cursor: pointer; margin-bottom: 15px; }
              .btn-primary { background-color: #007acc; color: white; }
              .btn-primary:hover { background-color: #005a9e; }
              .oauth-buttons { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
              .oauth-btn { padding: 10px; border: 1px solid #ddd; border-radius: 6px; background: white; cursor: pointer; font-size: 14px; }
              .oauth-btn.github { border-color: #24292e; color: #24292e; }
              .oauth-btn.google { border-color: #4285f4; color: #4285f4; }
              .divider { text-align: center; margin: 20px 0; position: relative; }
              .divider::before { content: ''; position: absolute; top: 50%; left: 0; right: 0; height: 1px; background-color: #ddd; }
              .divider span { background-color: white; padding: 0 15px; color: #666; font-size: 14px; }
              .back-link { text-align: center; margin-top: 20px; }
              .back-link a { color: #007acc; text-decoration: none; }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <div class="title">Sign In</div>
                  <div class="subtitle">Welcome back to Synapse</div>
              </div>
              
              <form id="loginForm">
                  <div class="form-group">
                      <label for="email">Email</label>
                      <input type="email" id="email" name="email" required>
                  </div>
                  <div class="form-group">
                      <label for="password">Password</label>
                      <input type="password" id="password" name="password" required>
                  </div>
                  <button type="submit" class="btn btn-primary">Sign In</button>
              </form>
              
              <div class="divider">
                  <span>or</span>
              </div>
              
              <div class="oauth-buttons">
                  <button class="oauth-btn github" onclick="oauthLogin('github')">GitHub</button>
                  <button class="oauth-btn google" onclick="oauthLogin('google')">Google</button>
              </div>
              
              <div class="back-link">
                  <a href="/">← Back to Home</a>
              </div>
          </div>
          
          <script>
              document.getElementById('loginForm').addEventListener('submit', async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  const data = Object.fromEntries(formData);
                  
                  try {
                      const response = await fetch('/login', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(data)
                      });
                      
                      const result = await response.json();
                      if (result.success) {
                          alert('Login successful!');
                          window.location.href = '/redirect?editor=vscode';
                      } else {
                          alert('Login failed: ' + result.message);
                      }
                  } catch (error) {
                      alert('Login failed: ' + error.message);
                  }
              });
              
              function oauthLogin(provider) {
                  alert('OAuth with ' + provider + ' coming soon!');
              }
          </script>
      </body>
      </html>
    `;
    
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
  }

  private serveSignupPage(res: http.ServerResponse): void {
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Create Account - Synapse</title>
          <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5; color: #333; line-height: 1.6; }
              .container { max-width: 400px; margin: 50px auto; padding: 30px; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
              .header { text-align: center; margin-bottom: 30px; }
              .title { font-size: 24px; font-weight: 600; margin-bottom: 5px; }
              .subtitle { font-size: 14px; color: #666; }
              .form-group { margin-bottom: 20px; }
              .form-group label { display: block; margin-bottom: 8px; font-weight: 500; font-size: 14px; }
              .form-group input { width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; }
              .btn { width: 100%; padding: 12px; border: none; border-radius: 6px; font-size: 16px; font-weight: 500; cursor: pointer; margin-bottom: 15px; }
              .btn-primary { background-color: #007acc; color: white; }
              .btn-primary:hover { background-color: #005a9e; }
              .oauth-buttons { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
              .oauth-btn { padding: 10px; border: 1px solid #ddd; border-radius: 6px; background: white; cursor: pointer; font-size: 14px; }
              .oauth-btn.github { border-color: #24292e; color: #24292e; }
              .oauth-btn.google { border-color: #4285f4; color: #4285f4; }
              .divider { text-align: center; margin: 20px 0; position: relative; }
              .divider::before { content: ''; position: absolute; top: 50%; left: 0; right: 0; height: 1px; background-color: #ddd; }
              .divider span { background-color: white; padding: 0 15px; color: #666; font-size: 14px; }
              .back-link { text-align: center; margin-top: 20px; }
              .back-link a { color: #007acc; text-decoration: none; }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <div class="title">Create Account</div>
                  <div class="subtitle">Join Synapse Learning Platform</div>
              </div>
              
              <form id="signupForm">
                  <div class="form-group">
                      <label for="name">Full Name</label>
                      <input type="text" id="name" name="name" required>
                  </div>
                  <div class="form-group">
                      <label for="email">Email</label>
                      <input type="email" id="email" name="email" required>
                  </div>
                  <div class="form-group">
                      <label for="password">Password</label>
                      <input type="password" id="password" name="password" required>
                  </div>
                  <button type="submit" class="btn btn-primary">Create Account</button>
              </form>
              
              <div class="divider">
                  <span>or</span>
              </div>
              
              <div class="oauth-buttons">
                  <button class="oauth-btn github" onclick="oauthSignup('github')">GitHub</button>
                  <button class="oauth-btn google" onclick="oauthSignup('google')">Google</button>
              </div>
              
              <div class="back-link">
                  <a href="/">← Back to Home</a>
              </div>
          </div>
          
          <script>
              document.getElementById('signupForm').addEventListener('submit', async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  const data = Object.fromEntries(formData);
                  
                  try {
                      const response = await fetch('/signup', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(data)
                      });
                      
                      const result = await response.json();
                      if (result.success) {
                          alert('Account created successfully!');
                          window.location.href = '/login';
                      } else {
                          alert('Signup failed: ' + result.message);
                      }
                  } catch (error) {
                      alert('Signup failed: ' + error.message);
                  }
              });
              
              function oauthSignup(provider) {
                  alert('OAuth signup with ' + provider + ' coming soon!');
              }
          </script>
      </body>
      </html>
    `;
    
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
  }

  private async handleLogin(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
    try {
      const body = await this.getRequestBody(req);
      const { email, password } = body as AuthRequest;
      
      if (!email || !password) {
        this.sendJsonResponse(res, 400, { success: false, message: 'Email and password are required' });
        return;
      }
      
      // Simulate authentication (in real app, check against database)
      if (this.users.has(email)) {
        const user = this.users.get(email);
        if (user.password === password) {
          const token = this.generateToken();
          this.tokens.set(token, email);
          
          this.sendJsonResponse(res, 200, {
            success: true,
            message: 'Login successful',
            token,
            user: { email: user.email, name: user.name }
          });
        } else {
          this.sendJsonResponse(res, 401, { success: false, message: 'Invalid password' });
        }
      } else {
        this.sendJsonResponse(res, 401, { success: false, message: 'User not found' });
      }
    } catch (error) {
      this.sendJsonResponse(res, 500, { success: false, message: 'Internal server error' });
    }
  }

  private async handleSignup(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
    try {
      const body = await this.getRequestBody(req);
      const { name, email, password } = body as AuthRequest;
      
      if (!name || !email || !password) {
        this.sendJsonResponse(res, 400, { success: false, message: 'Name, email, and password are required' });
        return;
      }
      
      if (this.users.has(email)) {
        this.sendJsonResponse(res, 409, { success: false, message: 'User already exists' });
        return;
      }
      
      // Create user (in real app, save to database)
      this.users.set(email, { email, name, password });
      
      this.sendJsonResponse(res, 201, {
        success: true,
        message: 'Account created successfully'
      });
    } catch (error) {
      this.sendJsonResponse(res, 500, { success: false, message: 'Internal server error' });
    }
  }

  private async handleOAuth(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
    try {
      const body = await this.getRequestBody(req);
      const { provider } = body as AuthRequest;
      
      // Simulate OAuth flow (in real app, implement OAuth)
      this.sendJsonResponse(res, 200, {
        success: true,
        message: `OAuth with ${provider} successful`,
        redirect_url: `/redirect?provider=${provider}`
      });
    } catch (error) {
      this.sendJsonResponse(res, 500, { success: false, message: 'Internal server error' });
    }
  }

  private handleRedirect(req: http.IncomingMessage, res: http.ServerResponse): void {
    const parsedUrl = url.parse(req.url || '/', true);
    const { editor, provider } = parsedUrl.query;
    
    let redirectUrl = '';
    
    if (editor) {
      switch (editor) {
        case 'vscode':
          redirectUrl = 'vscode://file/';
          break;
        case 'cursor':
          redirectUrl = 'cursor://file/';
          break;
        case 'windsurf':
          redirectUrl = 'windsurf://file/';
          break;
        case 'tera':
          redirectUrl = 'tera://file/';
          break;
        default:
          redirectUrl = 'vscode://file/';
      }
    } else if (provider) {
      // OAuth redirect
      redirectUrl = 'vscode://file/';
    }
    
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Redirecting - Synapse</title>
          <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5; color: #333; line-height: 1.6; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
              .container { text-align: center; padding: 30px; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
              .title { font-size: 24px; font-weight: 600; margin-bottom: 15px; }
              .message { margin-bottom: 20px; color: #666; }
              .btn { display: inline-block; padding: 12px 24px; background-color: #007acc; color: white; text-decoration: none; border-radius: 6px; font-weight: 500; }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="title">Opening Synapse</div>
              <div class="message">Redirecting to your code editor...</div>
              <a href="${redirectUrl}" class="btn">Open Manually</a>
          </div>
          <script>
              setTimeout(() => {
                  window.location.href = '${redirectUrl}';
              }, 2000);
          </script>
      </body>
      </html>
    `;
    
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
  }

  private async getRequestBody(req: http.IncomingMessage): Promise<any> {
    return new Promise((resolve, reject) => {
      let body = '';
      req.on('data', chunk => body += chunk.toString());
      req.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  private sendJsonResponse(res: http.ServerResponse, statusCode: number, data: any): void {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
  }

  private methodNotAllowed(res: http.ServerResponse): void {
    res.writeHead(405, { 'Content-Type': 'text/plain' });
    res.end('Method Not Allowed');
  }

  private notFound(res: http.ServerResponse): void {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }

  private generateToken(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
}

// Start the server if this file is run directly
if (require.main === module) {
  const server = new AuthServer(3000);
  server.start();
}

export { AuthServer };
