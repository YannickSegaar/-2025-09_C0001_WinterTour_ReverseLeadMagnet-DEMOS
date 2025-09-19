#!/bin/bash

# Discover Destinations Demo Runner
# This script starts a local server to run the demo

echo "🚀 Starting Discover Destinations Demo..."
echo "📍 Demo URL: http://localhost:8000"
echo "🎯 Integration: Houston Space Center STEM Program page"
echo ""
echo "ℹ️  Instructions:"
echo "   1. The server will start automatically"
echo "   2. Your browser should open to the demo page"
echo "   3. Look for the chatbot in the bottom-right corner"
echo "   4. Press Ctrl+C to stop the server when done"
echo ""

# Navigate to demo directory
cd "$(dirname "$0")/demo"

# Check if Python 3 is available
if command -v python3 &> /dev/null; then
    echo "🐍 Using Python 3..."
    # Open browser after a short delay
    (sleep 2 && open http://localhost:8000) &
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    echo "🐍 Using Python 2..."
    # Open browser after a short delay
    (sleep 2 && open http://localhost:8000) &
    python -m SimpleHTTPServer 8000
else
    echo "❌ Python not found. Please install Python or use another method:"
    echo ""
    echo "Alternative methods:"
    echo "1. Node.js: npx http-server -p 8000"
    echo "2. PHP: php -S localhost:8000"
    echo "3. Manual: Open demo/index.html directly in browser"
    exit 1
fi