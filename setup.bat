@echo off
REM Setup script for MR-ANKISH project (Windows)
REM This script helps configure the project for local development

echo.
echo ==========================================
echo MR ANKISH - Project Setup (Windows)
echo ==========================================
echo.

REM Check if .env exists
if not exist ".env" (
    echo Creating .env file from .env.example...
    copy .env.example .env
    echo Created .env
    echo.
    echo WARNING: Edit .env with your actual values:
    echo   - MONGO_URI (from MongoDB Atlas)
    echo   - SECRET_KEY (generate a random string)
    echo   - ADMIN_USER and ADMIN_PASS
    echo.
) else (
    echo .env file already exists
)

REM Check Python
echo.
echo Checking Python...
python --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('python --version') do set PYTHON_VERSION=%%i
    echo Python found: %PYTHON_VERSION%
) else (
    echo Python not found. Please install Python 3.9+
    pause
    exit /b 1
)

REM Check Node.js
echo.
echo Checking Node.js...
node --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    echo Node.js found: %NODE_VERSION%
) else (
    echo Node.js not found. Please install Node.js 18+
    pause
    exit /b 1
)

REM Setup Frontend
echo.
echo ==========================================
echo Frontend Setup (React + Vite)
echo ==========================================
cd FRONTEND

if not exist ".env.local" (
    echo Creating .env.local...
    (
        echo VITE_API_URL=http://localhost:5000
        echo VITE_ENV=development
    ) > .env.local
    echo Created FRONTEND\.env.local
) else (
    echo FRONTEND\.env.local already exists
)

if not exist "node_modules" (
    echo.
    echo Installing frontend dependencies...
    call npm install
    echo Frontend dependencies installed
) else (
    echo Frontend dependencies already installed
)

cd ..

REM Setup Backend
echo.
echo ==========================================
echo Backend Setup (Flask + MongoDB)
echo ==========================================
cd BACKEND

if not exist "venv" (
    echo Creating Python virtual environment...
    python -m venv venv
    echo Virtual environment created
    
    echo.
    echo Installing Python dependencies...
    call venv\Scripts\activate.bat
    pip install -r requirements.txt
    echo Backend dependencies installed
) else (
    echo Virtual environment already exists
)

cd ..

echo.
echo ==========================================
echo Setup Complete!
echo ==========================================
echo.
echo Next steps:
echo.
echo 1. Configure environment:
echo    - Edit .env file with your values:
echo    - MONGO_URI (required from MongoDB Atlas)
echo    - SECRET_KEY (generate a secure random string)
echo    - ADMIN_USER and ADMIN_PASS
echo.
echo 2. Start Frontend:
echo    cd FRONTEND
echo    npm run dev
echo    Opens on http://localhost:5173
echo.
echo 3. Start Backend (in another terminal):
echo    cd BACKEND
echo    venv\Scripts\activate.bat
echo    python app.py
echo    Runs on http://localhost:5000
echo.
echo 4. Test API:
echo    curl http://localhost:5000/api/health
echo.
echo For detailed setup, see: COMPLETE_INTEGRATION_GUIDE.md
echo.
pause
