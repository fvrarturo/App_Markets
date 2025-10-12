#!/bin/bash

echo "🚀 Starting Morgan Stanley Markets Dashboard..."
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

# Check if Node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16 or higher."
    exit 1
fi

echo "📦 Setting up backend..."
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install Python dependencies
echo "Installing Python dependencies..."
pip install -q -r requirements.txt

# Start backend in background
echo "Starting Flask backend on port 5000..."
python app.py &
BACKEND_PID=$!

cd ..

echo ""
echo "📦 Setting up frontend..."
cd frontend

# Install Node dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing Node dependencies..."
    npm install
fi

# Start frontend
echo "Starting React frontend on port 3000..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Application is starting!"
echo ""
echo "📊 Backend API: http://localhost:5000"
echo "🌐 Frontend UI: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID

