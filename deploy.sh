#!/bin/bash

# 🚀 Deploy Script for Shortener API on Vercel
# This script automates the deployment process

set -e  # Exit on any error

echo "🚀 Starting Shortener API deployment to Vercel..."

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

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is required but not installed."
        exit 1
    fi
    
    if ! command -v pnpm &> /dev/null; then
        print_error "pnpm is required but not installed. Run: npm install -g pnpm"
        exit 1
    fi
    
    if ! command -v vercel &> /dev/null; then
        print_error "Vercel CLI is required but not installed. Run: npm install -g vercel"
        exit 1
    fi
    
    print_success "All dependencies are installed"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    pnpm install
    print_success "Dependencies installed"
}

# Run tests
run_tests() {
    print_status "Running tests..."
    if pnpm test; then
        print_success "All tests passed"
    else
        print_error "Tests failed. Deployment aborted."
        exit 1
    fi
}

# Build the project
build_project() {
    print_status "Building project..."
    pnpm build
    print_success "Project built successfully"
}

# Generate Prisma client
generate_prisma() {
    print_status "Generating Prisma client..."
    pnpm prisma:generate
    print_success "Prisma client generated"
}

# Deploy to Vercel
deploy_to_vercel() {
    print_status "Deploying to Vercel..."
    
    # Check if this is a production deploy
    if [[ "$1" == "--prod" ]]; then
        print_warning "Deploying to PRODUCTION environment"
        read -p "Are you sure you want to deploy to production? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_error "Production deployment cancelled"
            exit 1
        fi
        vercel --prod
    else
        print_status "Deploying to preview environment"
        vercel
    fi
    
    print_success "Deployment completed"
}

# Get deployment URL
get_deployment_url() {
    print_status "Getting deployment URL..."
    DEPLOYMENT_URL=$(vercel ls | head -2 | tail -1 | awk '{print $2}')
    if [[ -n "$DEPLOYMENT_URL" ]]; then
        print_success "Deployment URL: https://$DEPLOYMENT_URL"
        echo
        echo "📚 API Documentation: https://$DEPLOYMENT_URL/api-docs"
        echo "🏥 Health Check: https://$DEPLOYMENT_URL/health"
        echo "📊 Metrics: https://$DEPLOYMENT_URL/metrics"
    fi
}

# Run deployment health check
health_check() {
    if [[ -n "$DEPLOYMENT_URL" ]]; then
        print_status "Running health check..."
        sleep 5  # Wait for deployment to be ready
        
        if curl -s -f "https://$DEPLOYMENT_URL/health" > /dev/null; then
            print_success "Health check passed - API is running"
        else
            print_warning "Health check failed - please verify manually"
        fi
    fi
}

# Main deployment process
main() {
    echo "🔧 Shortener API - Vercel Deployment Script"
    echo "=========================================="
    echo
    
    check_dependencies
    install_dependencies
    
    # Skip tests in CI or if --skip-tests flag is provided
    if [[ "$CI" != "true" && "$1" != "--skip-tests" && "$2" != "--skip-tests" ]]; then
        run_tests
    else
        print_warning "Skipping tests"
    fi
    
    generate_prisma
    build_project
    deploy_to_vercel "$1"
    get_deployment_url
    health_check
    
    echo
    print_success "🎉 Deployment completed successfully!"
    echo
    echo "Next steps:"
    echo "1. Test your API endpoints at https://$DEPLOYMENT_URL/api-docs"
    echo "2. Verify database connectivity"
    echo "3. Check logs with: vercel logs"
    echo "4. Monitor performance at: https://vercel.com/dashboard"
}

# Handle script arguments
case "$1" in
    --help|-h)
        echo "🚀 Shortener API Deployment Script"
        echo
        echo "Usage:"
        echo "  ./deploy.sh                 Deploy to preview environment"
        echo "  ./deploy.sh --prod          Deploy to production environment"
        echo "  ./deploy.sh --skip-tests    Skip running tests before deploy"
        echo "  ./deploy.sh --help          Show this help message"
        echo
        echo "Examples:"
        echo "  ./deploy.sh --prod          Production deployment"
        echo "  ./deploy.sh --skip-tests    Quick deployment without tests"
        exit 0
        ;;
    *)
        main "$@"
        ;;
esac
