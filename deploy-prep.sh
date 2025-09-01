#!/bin/bash
# Project NETRA - Quick Deployment Script

echo "🚀 Project NETRA - Deployment Preparation"
echo "=========================================="

# Check if we're in the right directory
if [ ! -f "README.md" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

echo "📦 Preparing for deployment..."

# Frontend preparation
echo "🎨 Preparing frontend for Vercel..."
cd frontend

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📥 Installing frontend dependencies..."
    npm install
fi

# Build the frontend to test
echo "🔨 Testing frontend build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Frontend build successful!"
else
    echo "❌ Frontend build failed. Please check for errors."
    exit 1
fi

cd ..

# Backend preparation
echo "🔧 Preparing backend..."
cd backend

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "🐍 Creating Python virtual environment..."
    python -m venv venv
fi

# Activate virtual environment
echo "🔄 Activating virtual environment..."
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    source venv/Scripts/activate
else
    source venv/bin/activate
fi

# Install dependencies
echo "📥 Installing backend dependencies..."
pip install -r requirements.txt

# Test the application
echo "🧪 Testing backend..."
python -c "
import sys
try:
    from app import app
    print('✅ Backend imports successful!')
except ImportError as e:
    print(f'❌ Import error: {e}')
    sys.exit(1)
"

cd ..

echo ""
echo "✅ Deployment preparation complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Push your code to GitHub"
echo "2. Set up Neo4j Aura database"
echo "3. Deploy backend to Railway: https://railway.app"
echo "4. Deploy frontend to Vercel: https://vercel.com"
echo "5. Configure environment variables"
echo ""
echo "📖 See DEPLOYMENT_GUIDE.md for detailed instructions"
echo ""
