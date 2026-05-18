#!/bin/bash
# Setup script for MR-ANKISH project
# This script helps configure the project for local development

echo "=========================================="
echo "MR ANKISH - Project Setup"
echo "=========================================="
echo ""

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "📋 Creating .env file from .env.example..."
    cp .env.example .env
    echo "✓ Created .env"
    echo ""
    echo "⚠️  IMPORTANT: Edit .env with your actual values:"
    echo "   - MONGO_URI (from MongoDB Atlas)"
    echo "   - SECRET_KEY (generate a random string)"
    echo "   - ADMIN_USER and ADMIN_PASS"
    echo ""
else
    echo "✓ .env file already exists"
fi

# Check Python
echo ""
echo "🐍 Checking Python..."
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version)
    echo "✓ Python found: $PYTHON_VERSION"
else
    echo "✗ Python not found. Please install Python 3.9+"
    exit 1
fi

# Check Node.js
echo ""
echo "📦 Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✓ Node.js found: $NODE_VERSION"
else
    echo "✗ Node.js not found. Please install Node.js 18+"
    exit 1
fi

# Setup Frontend
echo ""
echo "=========================================="
echo "Frontend Setup (React + Vite)"
echo "=========================================="
cd FRONTEND

if [ ! -f ".env.local" ]; then
    echo "Creating .env.local..."
    cat > .env.local << EOF
VITE_API_URL=http://localhost:5000
VITE_ENV=development
EOF
    echo "✓ Created FRONTEND/.env.local"
else
    echo "✓ FRONTEND/.env.local already exists"
fi

if [ ! -d "node_modules" ]; then
    echo ""
    echo "📥 Installing frontend dependencies..."
    npm install
    echo "✓ Frontend dependencies installed"
else
    echo "✓ Frontend dependencies already installed"
fi

cd ..

# Setup Backend
echo ""
echo "=========================================="
echo "Backend Setup (Flask + MongoDB)"
echo "=========================================="
cd BACKEND

if [ ! -d "venv" ]; then
    echo "🐍 Creating Python virtual environment..."
    python3 -m venv venv
    echo "✓ Virtual environment created"
    
    echo ""
    echo "📥 Installing Python dependencies..."
    if [ -f "venv/bin/activate" ]; then
        source venv/bin/activate
    else
        . venv/Scripts/activate  # Windows
    fi
    pip install -r requirements.txt
    echo "✓ Backend dependencies installed"
else
    echo "✓ Virtual environment already exists"
fi

cd ..

echo ""
echo "=========================================="
echo "✅ Setup Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo ""
echo "1️⃣  Configure environment:"
echo "   - Edit .env file with your values:"
echo "   - MONGO_URI (required)"
echo "   - SECRET_KEY (required)"
echo "   - ADMIN_USER and ADMIN_PASS"
echo ""
echo "2️⃣  Start Frontend:"
echo "   cd FRONTEND"
echo "   npm run dev"
echo "   Opens on http://localhost:5173"
echo ""
echo "3️⃣  Start Backend (in another terminal):"
echo "   cd BACKEND"
echo "   source venv/bin/activate  # On Windows: venv\\Scripts\\activate"
echo "   python app.py"
echo "   Runs on http://localhost:5000"
echo ""
echo "4️⃣  Test API:"
echo "   curl http://localhost:5000/api/health"
echo ""
echo "📖 For detailed setup, see: COMPLETE_INTEGRATION_GUIDE.md"
echo ""
