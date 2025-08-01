# 🚀 Deploy Script for Shortener API on Vercel (PowerShell)
# This script automates the deployment process for Windows users

param(
    [switch]$Prod,
    [switch]$SkipTests,
    [switch]$Help
)

# Colors for output
$ErrorColor = "Red"
$SuccessColor = "Green"
$WarningColor = "Yellow"
$InfoColor = "Cyan"

function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor $InfoColor
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor $SuccessColor
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor $WarningColor
}

function Write-Error-Custom {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor $ErrorColor
}

function Check-Dependencies {
    Write-Status "Checking dependencies..."
    
    # Check Node.js
    if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
        Write-Error-Custom "Node.js is required but not installed."
        Write-Host "Download from: https://nodejs.org/" -ForegroundColor Yellow
        exit 1
    }
    
    # Check pnpm
    if (-not (Get-Command pnpm -ErrorAction SilentlyContinue)) {
        Write-Error-Custom "pnpm is required but not installed."
        Write-Host "Install with: npm install -g pnpm" -ForegroundColor Yellow
        exit 1
    }
    
    # Check Vercel CLI
    if (-not (Get-Command vercel -ErrorAction SilentlyContinue)) {
        Write-Error-Custom "Vercel CLI is required but not installed."
        Write-Host "Install with: npm install -g vercel" -ForegroundColor Yellow
        exit 1
    }
    
    Write-Success "All dependencies are installed"
}

function Install-Dependencies {
    Write-Status "Installing dependencies..."
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Write-Error-Custom "Failed to install dependencies"
        exit 1
    }
    Write-Success "Dependencies installed"
}

function Run-Tests {
    Write-Status "Running tests..."
    pnpm test
    if ($LASTEXITCODE -ne 0) {
        Write-Error-Custom "Tests failed. Deployment aborted."
        exit 1
    }
    Write-Success "All tests passed"
}

function Build-Project {
    Write-Status "Building project..."
    pnpm build
    if ($LASTEXITCODE -ne 0) {
        Write-Error-Custom "Build failed"
        exit 1
    }
    Write-Success "Project built successfully"
}

function Generate-Prisma {
    Write-Status "Generating Prisma client..."
    pnpm prisma:generate
    if ($LASTEXITCODE -ne 0) {
        Write-Error-Custom "Prisma generation failed"
        exit 1
    }
    Write-Success "Prisma client generated"
}

function Deploy-ToVercel {
    param([bool]$IsProduction)
    
    Write-Status "Deploying to Vercel..."
    
    if ($IsProduction) {
        Write-Warning "Deploying to PRODUCTION environment"
        $confirmation = Read-Host "Are you sure you want to deploy to production? (y/N)"
        if ($confirmation -ne "y" -and $confirmation -ne "Y") {
            Write-Error-Custom "Production deployment cancelled"
            exit 1
        }
        vercel --prod
    } else {
        Write-Status "Deploying to preview environment"
        vercel
    }
    
    if ($LASTEXITCODE -ne 0) {
        Write-Error-Custom "Deployment failed"
        exit 1
    }
    
    Write-Success "Deployment completed"
}

function Get-DeploymentUrl {
    Write-Status "Getting deployment URL..."
    
    try {
        $deployments = vercel ls --json | ConvertFrom-Json
        if ($deployments -and $deployments.Length -gt 0) {
            $latestDeployment = $deployments[0]
            $script:DeploymentUrl = "https://$($latestDeployment.url)"
            
            Write-Success "Deployment URL: $script:DeploymentUrl"
            Write-Host ""
            Write-Host "📚 API Documentation: $script:DeploymentUrl/api-docs" -ForegroundColor Green
            Write-Host "🏥 Health Check: $script:DeploymentUrl/health" -ForegroundColor Green
            Write-Host "📊 Metrics: $script:DeploymentUrl/metrics" -ForegroundColor Green
        }
    } catch {
        Write-Warning "Could not retrieve deployment URL automatically"
    }
}

function Test-HealthCheck {
    if ($script:DeploymentUrl) {
        Write-Status "Running health check..."
        Start-Sleep -Seconds 5  # Wait for deployment to be ready
        
        try {
            $response = Invoke-WebRequest -Uri "$script:DeploymentUrl/health" -UseBasicParsing -TimeoutSec 30
            if ($response.StatusCode -eq 200) {
                Write-Success "Health check passed - API is running"
            } else {
                Write-Warning "Health check returned status: $($response.StatusCode)"
            }
        } catch {
            Write-Warning "Health check failed - please verify manually"
            Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Yellow
        }
    }
}

function Show-Help {
    Write-Host "🚀 Shortener API Deployment Script" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Usage:" -ForegroundColor White
    Write-Host "  .\deploy.ps1                Deploy to preview environment"
    Write-Host "  .\deploy.ps1 -Prod           Deploy to production environment"
    Write-Host "  .\deploy.ps1 -SkipTests      Skip running tests before deploy"
    Write-Host "  .\deploy.ps1 -Help           Show this help message"
    Write-Host ""
    Write-Host "Examples:" -ForegroundColor White
    Write-Host "  .\deploy.ps1 -Prod           Production deployment"
    Write-Host "  .\deploy.ps1 -SkipTests      Quick deployment without tests"
    Write-Host "  .\deploy.ps1 -Prod -SkipTests Production deployment without tests"
    Write-Host ""
    Write-Host "Prerequisites:" -ForegroundColor White
    Write-Host "  - Node.js (https://nodejs.org/)"
    Write-Host "  - pnpm (npm install -g pnpm)"
    Write-Host "  - Vercel CLI (npm install -g vercel)"
    exit 0
}

function Main {
    if ($Help) {
        Show-Help
        return
    }
    
    Write-Host "🔧 Shortener API - Vercel Deployment Script" -ForegroundColor Cyan
    Write-Host "==========================================" -ForegroundColor Cyan
    Write-Host ""
    
    Check-Dependencies
    Install-Dependencies
    
    # Skip tests in CI or if -SkipTests flag is provided
    if (-not $SkipTests -and -not $env:CI) {
        Run-Tests
    } else {
        Write-Warning "Skipping tests"
    }
    
    Generate-Prisma
    Build-Project
    Deploy-ToVercel -IsProduction $Prod
    Get-DeploymentUrl
    Test-HealthCheck
    
    Write-Host ""
    Write-Success "🎉 Deployment completed successfully!"
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor White
    Write-Host "1. Test your API endpoints at $script:DeploymentUrl/api-docs"
    Write-Host "2. Verify database connectivity"
    Write-Host "3. Check logs with: vercel logs"
    Write-Host "4. Monitor performance at: https://vercel.com/dashboard"
}

# Set error action preference
$ErrorActionPreference = "Stop"

# Initialize deployment URL variable
$script:DeploymentUrl = $null

try {
    Main
} catch {
    Write-Error-Custom "Deployment failed with error: $($_.Exception.Message)"
    exit 1
}
