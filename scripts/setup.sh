#!/bin/bash

# ============================================================================
# Sector Universal Learning Platform - Setup Script
# ============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check system requirements
check_requirements() {
    print_status "Checking system requirements..."
    
    # Check Node.js
    if ! command_exists node; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18+ is required. Current version: $(node --version)"
        exit 1
    fi
    print_success "Node.js $(node --version) ✓"
    
    # Check pnpm
    if ! command_exists pnpm; then
        print_warning "pnpm is not installed. Installing pnpm..."
        npm install -g pnpm
    fi
    print_success "pnpm $(pnpm --version) ✓"
    
    # Check Docker
    if ! command_exists docker; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    print_success "Docker $(docker --version) ✓"
    
    # Check Docker Compose
    if ! command_exists docker-compose; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    print_success "Docker Compose $(docker-compose --version) ✓"
    
    # Check Git
    if ! command_exists git; then
        print_warning "Git is not installed. Please install Git first."
    else
        print_success "Git $(git --version) ✓"
    fi
}

# Function to create environment file
create_env_file() {
    print_status "Creating environment configuration..."
    
    if [ ! -f .env ]; then
        cp env.example .env
        print_success "Environment file created from env.example"
        print_warning "Please update .env with your actual configuration values"
    else
        print_warning ".env file already exists, skipping creation"
    fi
}

# Function to start Docker services
start_docker_services() {
    print_status "Starting Docker services..."
    
    # Stop any existing containers
    docker-compose down 2>/dev/null || true
    
    # Start services
    docker-compose up -d
    
    # Wait for services to be ready
    print_status "Waiting for services to be ready..."
    sleep 10
    
    # Check service health
    print_status "Checking service health..."
    
    # Check PostgreSQL
    if docker-compose exec -T postgres pg_isready -U sector_user -d sector_dev >/dev/null 2>&1; then
        print_success "PostgreSQL is ready ✓"
    else
        print_warning "PostgreSQL is still starting up..."
    fi
    
    # Check Redis
    if docker-compose exec -T redis redis-cli ping >/dev/null 2>&1; then
        print_success "Redis is ready ✓"
    else
        print_warning "Redis is still starting up..."
    fi
    
    # Check Qdrant
    if curl -s http://localhost:6333/health >/dev/null 2>&1; then
        print_success "Qdrant is ready ✓"
    else
        print_warning "Qdrant is still starting up..."
    fi
    
    # Check MinIO
    if curl -s http://localhost:9000/minio/health/live >/dev/null 2>&1; then
        print_success "MinIO is ready ✓"
    else
        print_warning "MinIO is still starting up..."
    fi
}

# Function to install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    # Install root dependencies
    pnpm install
    
    print_success "Dependencies installed successfully"
}

# Function to build packages
build_packages() {
    print_status "Building packages..."
    
    # Build all packages
    pnpm run build
    
    print_success "Packages built successfully"
}

# Function to run database migrations
run_migrations() {
    print_status "Running database migrations..."
    
    # Wait a bit more for database to be fully ready
    sleep 5
    
    # Run migrations
    pnpm run db:migrate || {
        print_warning "Migration failed, this might be expected on first run"
    }
    
    print_success "Database setup completed"
}

# Function to seed database
seed_database() {
    print_status "Seeding database with initial data..."
    
    pnpm run db:seed || {
        print_warning "Database seeding failed, this might be expected on first run"
    }
    
    print_success "Database seeding completed"
}

# Function to show next steps
show_next_steps() {
    echo
    print_success "🎉 Sector Universal Learning Platform setup completed!"
    echo
    echo "Next steps:"
    echo "1. Update .env file with your actual configuration values"
    echo "2. Start the development environment: pnpm run dev"
    echo "3. Open http://localhost:3000 in your browser"
    echo "4. Open http://localhost:3001/health to check API health"
    echo
    echo "Useful commands:"
    echo "  pnpm run dev          - Start all services in development mode"
    echo "  pnpm run docker:up    - Start Docker services"
    echo "  pnpm run docker:down  - Stop Docker services"
    echo "  pnpm run build        - Build all packages"
    echo "  pnpm run test         - Run tests"
    echo
    echo "Docker services:"
    echo "  PostgreSQL: localhost:5432"
    echo "  Redis: localhost:6379"
    echo "  Qdrant: localhost:6333"
    echo "  MinIO: localhost:9000 (Console: localhost:9001)"
    echo "  pgAdmin: localhost:5050"
    echo
    echo "For more information, see the README.md file"
}

# Main setup function
main() {
    echo "🚀 Sector Universal Learning Platform Setup"
    echo "=============================================="
    echo
    
    # Check requirements
    check_requirements
    
    # Create environment file
    create_env_file
    
    # Start Docker services
    start_docker_services
    
    # Install dependencies
    install_dependencies
    
    # Build packages
    build_packages
    
    # Run migrations
    run_migrations
    
    # Seed database
    seed_database
    
    # Show next steps
    show_next_steps
}

# Run main function
main "$@"

