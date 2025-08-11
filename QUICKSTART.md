# 🚀 Quick Start Guide - Sector Universal Learning Platform

Get the Sector Universal Learning Platform up and running in **under 10 minutes**!

## ⚡ Prerequisites

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **Docker & Docker Compose** - [Download here](https://www.docker.com/products/docker-desktop/)
- **Git** - [Download here](https://git-scm.com/)

## 🎯 Quick Setup (3 Steps)

### 1. Clone & Setup
```bash
# Clone the repository
git clone <your-repo-url>
cd synapse-universal-learning-platform

# Make setup script executable and run it
chmod +x scripts/setup.sh
./scripts/setup.sh
```

### 2. Configure Environment
```bash
# Copy and edit environment file
cp env.example .env

# Edit .env with your API keys (optional for basic usage)
nano .env
```

### 3. Start Development
```bash
# Start all services
pnpm run dev
```

## 🌐 Access Your Platform

- **Web App**: http://localhost:3000
- **API Server**: http://localhost:3001
- **API Health**: http://localhost:3001/health
- **pgAdmin**: http://localhost:5050 (admin@synapse.local / admin_password)
- **MinIO Console**: http://localhost:9001 (sector_admin / sector_admin_password)

## 🧪 Test the Platform

### 1. Check API Health
```bash
curl http://localhost:3001/health
# Should return: {"status":"ok","timestamp":"..."}
```

### 2. Create Your First Project
```bash
# Login via web interface first, then:
curl -X POST http://localhost:3001/projects \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Hello World","description":"My first project"}'
```

### 3. Run Code
```bash
# Upload a Python file and run it
curl -X POST http://localhost:3001/projects/PROJECT_ID/runs \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"language":"python","entryPoint":"main.py"}'
```

## 🔧 Common Commands

```bash
# Development
pnpm run dev              # Start all services
pnpm run build            # Build all packages
pnpm run test             # Run tests
pnpm run lint             # Lint code

# Docker
pnpm run docker:up        # Start Docker services
pnpm run docker:down      # Stop Docker services

# Database
pnpm run db:migrate       # Run migrations
pnpm run db:seed          # Seed database
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Check what's using the port
lsof -i :3001

# Kill the process or change port in .env
```

### Docker Issues
```bash
# Restart Docker services
docker-compose down
docker-compose up -d

# Check logs
docker-compose logs
```

### Database Connection Issues
```bash
# Wait for services to be ready
sleep 15

# Check service health
docker-compose ps
```

## 📚 What's Next?

1. **Explore the Web Interface** - Navigate to http://localhost:3000
2. **Create Your First Project** - Start with a simple "Hello World"
3. **Try AI Assistant** - Ask questions about your code
4. **Upload Documents** - Test the `@context` feature
5. **Visualize Code** - See execution traces and data structures

## 🆘 Need Help?

- 📖 **Full Documentation**: See [README.md](README.md)
- 🐛 **Issues**: Check existing issues or create new ones
- 💬 **Discussions**: Join the community discussions
- 📧 **Support**: Contact the development team

---

**🎉 You're all set! Welcome to the future of learning and coding!**

