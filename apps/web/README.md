# Synapse Learning Platform

A modern, intelligent learning platform built with Next.js, NextAuth.js, and Prisma. Synapse provides AI-powered learning assistance, real-time code analysis, and seamless VS Code extension integration.

## ✨ Features

- **🔐 Secure Authentication** - NextAuth.js with credentials provider
- **🎨 Modern UI** - Built with Shadcn UI and Tailwind CSS
- **🌙 Dark Theme** - Beautiful dark theme by default
- **📱 Responsive Design** - Works perfectly on all devices
- **🔌 VS Code Integration** - Seamless editor integration
- **📊 Learning Analytics** - Track your progress and goals
- **🤖 AI-Powered Learning** - Intelligent code analysis and suggestions

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm 8+
- PostgreSQL database

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd apps/web
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Set up environment variables:**
   ```bash
   cp env.local.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```env
   NEXTAUTH_SECRET=your-super-secret-nextauth-key
   NEXTAUTH_URL=http://localhost:3000
   DATABASE_URL="postgresql://username:password@localhost:5432/synapse_db"
   ```

4. **Set up the database:**
   ```bash
   pnpm prisma generate
   pnpm prisma db push
   ```

5. **Start the development server:**
   ```bash
   pnpm dev
   ```
   
   The app will open at `http://localhost:3000`

## 🏗️ Project Structure

```
apps/web/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   └── auth/          # Authentication endpoints
│   ├── dashboard/         # Dashboard page
│   ├── login/             # Login page
│   ├── register/          # Registration page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/             # React components
│   ├── ui/                # Shadcn UI components
│   ├── providers/         # Context providers
│   ├── login-form.tsx     # Login form
│   └── register-form.tsx  # Registration form
├── lib/                    # Utility libraries
│   ├── auth/              # Authentication utilities
│   └── utils.ts           # General utilities
├── prisma/                 # Database schema and migrations
└── public/                 # Static assets
```

## 🔐 Authentication

Synapse uses NextAuth.js with a credentials provider for secure authentication:

- **User Registration** - Email/password registration with validation
- **User Login** - Secure credential-based authentication
- **Session Management** - JWT-based sessions with automatic refresh
- **Protected Routes** - Automatic redirection for unauthenticated users

### API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login (via NextAuth)
- `GET /api/auth/[...nextauth]` - NextAuth.js endpoints

## 🎨 UI Components

Built with Shadcn UI and Tailwind CSS:

- **Responsive Design** - Mobile-first approach
- **Dark Theme** - Beautiful dark theme with CSS variables
- **Component Library** - Consistent, accessible UI components
- **Custom Animations** - Smooth transitions and micro-interactions

## 🔌 VS Code Extension Integration

Synapse seamlessly integrates with VS Code and other editors:

- **VS Code** - Primary integration target
- **Cursor** - AI-powered editor integration
- **Windsurf** - Modern web-based editor
- **Tera** - Alternative editor support

### Extension Features

- Real-time code analysis
- Learning recommendations
- Progress tracking
- AI-powered assistance

## 🛠️ Development

### Available Scripts

```bash
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint
pnpm prisma generate  # Generate Prisma client
pnpm prisma db push   # Push database schema
```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXTAUTH_SECRET` | NextAuth.js secret key | Yes |
| `NEXTAUTH_URL` | Application URL | Yes |
| `DATABASE_URL` | PostgreSQL connection string | Yes |

## 📱 Responsive Design

The application is fully responsive with:

- **Mobile First** - Designed for mobile devices first
- **Breakpoints** - Tailwind CSS responsive breakpoints
- **Touch Friendly** - Optimized for touch interactions
- **Progressive Enhancement** - Works on all device sizes

## 🚀 Deployment

### Build for Production

```bash
pnpm build
```

The built files will be in the `.next/` directory.

### Environment Configuration

For production, update your environment variables:

```env
NEXTAUTH_SECRET=your-production-secret
NEXTAUTH_URL=https://your-domain.com
DATABASE_URL=your-production-database-url
NODE_ENV=production
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is part of the Synapse Learning Platform and is licensed under the MIT License.

## 🆘 Support

For support and questions:

- Check the [documentation](https://docs.synapse.learning)
- Join our [community forum](https://community.synapse.learning)
- Open an [issue](https://github.com/synapse/learning-platform/issues)

## 🔮 Roadmap

- [ ] OAuth providers (Google, GitHub)
- [ ] Advanced AI features
- [ ] Real-time collaboration
- [ ] Mobile app
- [ ] Learning path customization
- [ ] Community features
- [ ] Advanced analytics
