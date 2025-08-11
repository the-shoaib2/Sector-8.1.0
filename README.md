# Sector Universal Learning Platform v8.1.0

> **Universal Intelligent Learning & Coding Assistant** - Advanced platform for learning programming, compilers, ML, AI with visualization, contextual AI, and multi-platform support.

## 🚀 Project Vision

Sector is an all-in-one learning platform that helps users:
- **Learn programming, compilers, ML, AI** through interactive visualizations
- **Code with AI assistance** using low-latency streaming prompts
- **Analyze documents contextually** with `@context` using Model Context Protocol (MCP)
- **Visualize code execution** and data structures in real-time
- **Work across platforms** - Web, VS Code, Desktop apps

## 🏗️ Architecture Overview

```
[Frontend Web (React/TS)] <-----> [API Gateway (TS + Fastify + TypeORM + JWT)]
                                         |
                                         | (HTTP + WebSocket/SSE)
                                         |
                            +-------------------------+
                            |       Message Bus        | (NATS/Redis/RabbitMQ)
                            +-------------------------+
                      /                  |                   \
    [Runner Worker (Rust/Node)]   [AI Worker (Python)]   [Export Worker (Node/Python)]
                     |                       |                      |
                [Sandboxed containers]   [ML/DL inference]    [PDF/Image generation]

                                  +-----------------------+
                                  |  Vector DB (Qdrant)   |
                                  +-----------------------+

                                  +-----------------------+
                                  | Blob Storage (S3)     |
                                  +-----------------------+
```

## 🛠️ Technology Stack

| Layer            | Technology / Library                     | Purpose                    |
| ---------------- | ---------------------------------------- | -------------------------- |
| Frontend         | React + TypeScript + Vite                | Fast dev, strong typing    |
| API Server       | Node.js + TypeScript + Fastify + TypeORM | Fast, typed, extensible    |
| Auth             | OAuth2 (GitHub & Google) + JWT + PKCE    | Secure, modern auth flows  |
| Real-time        | WebSocket / Server-Sent Events           | Streaming AI tokens        |
| DB               | PostgreSQL (cloud), SQLite (local/dev)   | Relational, JSONB support  |
| Message Bus      | NATS / Redis Streams / RabbitMQ          | Async decoupling          |
| Vector DB        | Qdrant / Pinecone / Milvus               | Document embeddings       |
| Blob Storage     | AWS S3 / MinIO / GCS                     | Store docs, artifacts     |
| Worker Languages | Python (ML) + Rust/Node (runner, export) | Best tools for each domain |
| Containerization | Docker + Kubernetes (optional)           | Sandboxing & orchestration |
| IDE Extensions   | VS Code (TS) + others                    | Wide user base            |
| Desktop App      | Electron / Tauri + SQLite                | Cross platform local mode  |

## 📁 Project Structure

```
sector-universal-learning-platform/
├── packages/                    # Shared packages
│   ├── common/                 # Shared types, utilities, constants
│   ├── database/               # Database schemas, migrations
│   ├── auth/                   # Authentication utilities
│   └── mcp/                    # Model Context Protocol server
├── apps/                       # Main applications
│   ├── web/                    # React web frontend
│   ├── api/                    # Fastify API server
│   ├── desktop/                # Electron/Tauri desktop app
│   └── vscode-extension/       # VS Code extension
├── workers/                     # Background workers
│   ├── ai-worker/              # Python AI/ML worker
│   ├── runner-worker/          # Rust/Node code execution worker
│   └── export-worker/          # Export/PDF generation worker
├── docker/                      # Docker configurations
├── docs/                        # Documentation
└── scripts/                     # Build and deployment scripts
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- pnpm 8+
- Docker & Docker Compose
- PostgreSQL (or use Docker)

### Setup
```bash
# Clone and install dependencies
git clone <repository-url>
cd sector-universal-learning-platform
pnpm install

# Start development environment
pnpm run setup

# Start all services
pnpm run dev
```

### Development Commands
```bash
pnpm run dev          # Start all services in development mode
pnpm run build        # Build all packages
pnpm run test         # Run tests across all packages
pnpm run lint         # Lint all packages
pnpm run docker:up    # Start Docker services
pnpm run docker:down  # Stop Docker services
```

## 🔑 Key Features

### 1. **User Authentication**
- OAuth2 with GitHub & Google
- JWT + refresh tokens
- Secure token sharing between web & extensions

### 2. **Project & Workspace Management**
- CRUD for projects, source files, runs
- Multi-language support
- Execution history and traces

### 3. **AI Assistant & Streaming**
- Low-latency token streaming
- Context-aware prompts
- Project code integration

### 4. **Contextual Document Analysis (`@context`)**
- Upload PDFs, books, documents
- Vector embeddings and retrieval
- MCP server for context-aware AI responses
- Provenance tracking

### 5. **Interactive Visualizations**
- Code execution trees
- Data structure animations
- Compiler phases & AST walks
- Neural network architectures

### 6. **Multi-Platform Support**
- Web application
- VS Code extension
- Desktop application
- API for integrations

### 7. **Export & Sharing**
- PDF, PNG, JPEG export
- Office formats (DOCX, PPTX)
- Shareable links with permissions

## 🔌 API Endpoints

| Method | Path                          | Description                      |
| ------ | ----------------------------- | -------------------------------- |
| POST   | `/auth/oauth/start`           | Redirect to OAuth provider       |
| POST   | `/auth/token/refresh`         | Refresh JWT token                |
| GET    | `/me`                         | Get current user profile         |
| GET    | `/projects`                   | List user projects               |
| POST   | `/projects`                   | Create project                   |
| POST   | `/projects/:id/runs`          | Create run job                   |
| GET    | `/runs/:id/events`            | WebSocket stream for run events  |
| POST   | `/prompts`                    | Submit AI prompt                 |
| GET    | `/prompts/:id/stream`         | AI token streaming endpoint      |
| POST   | `/context/session`            | Start MCP context session        |
| POST   | `/context/session/:id/prompt` | Send prompt within context       |
| POST   | `/documents`                  | Upload document                  |
| GET    | `/artifacts/:id`              | Download exported artifacts      |

## 🧪 Development Workflow

1. **Phase 1**: Core API + Auth + Project CRUD + Basic streaming
2. **Phase 2**: AI assistant + Document upload + Export worker
3. **Phase 3**: Context sessions + MCP server + Multi-language adapters
4. **Phase 4**: Advanced visualizations + Marketplace + Scaling

## 🔒 Security & Privacy

- JWT + refresh tokens
- OAuth2 with PKCE
- Sandboxed code execution
- Encrypted document storage
- Rate limiting & quotas
- Audit logging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🆘 Support

- [Documentation](docs/)
- [Issues](https://github.com/your-org/sector/issues)
- [Discussions](https://github.com/your-org/sector/discussions)

---

**Built with ❤️ for the learning community**

