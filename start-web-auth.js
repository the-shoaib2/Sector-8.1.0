#!/usr/bin/env node

const { AuthServer } = require('./dist/web/server.js');

console.log('🚀 Starting Synapse Web Authentication Server...');

const server = new AuthServer(3000);
server.start();

console.log('\n📱 Web Interface Available at:');
console.log('   Home: http://localhost:3000');
console.log('   Login: http://localhost:3000/login');
console.log('   Signup: http://localhost:3000/signup');
console.log('\n💻 After authentication, users will be redirected to:');
console.log('   - VS Code (vscode://)');
console.log('   - Cursor (cursor://)');
console.log('   - Windsurf (windsurf://)');
console.log('   - Tera (tera://)');
console.log('\n⏹️  Press Ctrl+C to stop the server');
