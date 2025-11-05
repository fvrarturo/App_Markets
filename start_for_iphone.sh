#!/bin/bash

# 📱 Markets Dashboard - iPhone Setup Script
# This script starts the app with network access for your iPhone

echo "📊 Starting Markets Dashboard for iPhone Access..."
echo ""

# Get Mac's IP address
IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null)

if [ -z "$IP" ]; then
    echo "❌ Could not detect IP address"
    echo "Run manually: ifconfig | grep 'inet '"
    exit 1
fi

echo "✅ Your Mac's IP Address: $IP"
echo ""
echo "📱 iPhone Instructions:"
echo "1. Make sure iPhone and Mac are on same WiFi"
echo "2. Open Safari on iPhone"
echo "3. Go to: http://$IP:3000"
echo "4. Tap Share → 'Add to Home Screen'"
echo ""
echo "🚀 Starting servers..."
echo ""

# Check if processes are already running
if lsof -i :5001 > /dev/null 2>&1; then
    echo "⚠️  Backend already running on port 5001"
else
    echo "Starting backend..."
    cd backend
    source venv/bin/activate
    python app.py &
    BACKEND_PID=$!
    cd ..
    sleep 3
fi

if lsof -i :3000 > /dev/null 2>&1; then
    echo "⚠️  Frontend already running on port 3000"
else
    echo "Starting frontend..."
    cd frontend
    npm run dev &
    FRONTEND_PID=$!
    cd ..
    sleep 3
fi

echo ""
echo "================================================================"
echo "✅ Markets Dashboard is now accessible on your network!"
echo ""
echo "📱 On your iPhone, open Safari and go to:"
echo ""
echo "    http://$IP:3000"
echo ""
echo "================================================================"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Keep script running
wait

