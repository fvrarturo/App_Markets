@echo off
echo.
echo Starting Morgan Stanley Markets Dashboard...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Python is not installed. Please install Python 3.8 or higher.
    pause
    exit /b 1
)

REM Check if Node is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo Node.js is not installed. Please install Node.js 16 or higher.
    pause
    exit /b 1
)

echo Setting up backend...
cd backend

REM Create virtual environment if it doesn't exist
if not exist "venv" (
    echo Creating Python virtual environment...
    python -m venv venv
)

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Install Python dependencies
echo Installing Python dependencies...
pip install -q -r requirements.txt

REM Start backend
echo Starting Flask backend on port 5000...
start /B python app.py

cd ..

echo.
echo Setting up frontend...
cd frontend

REM Install Node dependencies if needed
if not exist "node_modules" (
    echo Installing Node dependencies...
    call npm install
)

REM Start frontend
echo Starting React frontend on port 3000...
start /B npm run dev

echo.
echo Application is starting!
echo.
echo Backend API: http://localhost:5000
echo Frontend UI: http://localhost:3000
echo.
echo Press Ctrl+C to stop
echo.

pause

