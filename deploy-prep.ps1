# Project NETRA - Deployment Preparation Script (PowerShell)

Write-Host "Project NETRA - Deployment Preparation" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan

# Check if we're in the right directory
if (-not (Test-Path "README.md")) {
    Write-Host "Please run this script from the project root directory" -ForegroundColor Red
    exit 1
}

Write-Host "Preparing for deployment..." -ForegroundColor Yellow

# Frontend preparation
Write-Host "Preparing frontend for Vercel..." -ForegroundColor Green
Set-Location frontend

# Install dependencies if node_modules doesn't exist
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
    npm install
}

# Build the frontend to test
Write-Host "Testing frontend build..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "Frontend build successful!" -ForegroundColor Green
} else {
    Write-Host "Frontend build failed. Please check for errors." -ForegroundColor Red
    exit 1
}

Set-Location ..

# Backend preparation
Write-Host "Preparing backend..." -ForegroundColor Green
Set-Location backend

# Check if virtual environment exists
if (-not (Test-Path "venv")) {
    Write-Host "Creating Python virtual environment..." -ForegroundColor Yellow
    python -m venv venv
}

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Yellow
& "venv\Scripts\Activate.ps1"

# Install dependencies
Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
pip install -r requirements.txt

# Test the application imports
Write-Host "Testing backend imports..." -ForegroundColor Yellow
$testResult = python -c "
try:
    from app import app
    print('Backend imports successful!')
    exit(0)
except ImportError as e:
    print('Import error:', str(e))
    exit(1)
"

Set-Location ..

Write-Host ""
Write-Host "Deployment preparation complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "1. Push your code to GitHub" -ForegroundColor White
Write-Host "2. Set up Neo4j Aura database" -ForegroundColor White
Write-Host "3. Deploy backend to Railway: https://railway.app" -ForegroundColor White
Write-Host "4. Deploy frontend to Vercel: https://vercel.com" -ForegroundColor White
Write-Host "5. Configure environment variables" -ForegroundColor White
Write-Host ""
Write-Host "See DEPLOYMENT_GUIDE.md for detailed instructions" -ForegroundColor Yellow
Write-Host ""
