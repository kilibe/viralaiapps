#!/bin/bash

# Simple script to start a local web server for testing
# This will serve your website at http://localhost:8000

cd /Users/leepingwong/viralaiapps

# Check if Python 3 is available
if command -v python3 &> /dev/null; then
    echo "Starting web server on http://localhost:8080"
    echo "Press Ctrl+C to stop the server"
    python3 -m http.server 8080
# Check if Python 2 is available
elif command -v python &> /dev/null; then
    echo "Starting web server on http://localhost:8080"
    echo "Press Ctrl+C to stop the server"
    python -m SimpleHTTPServer 8080
# Check if Node.js is available
elif command -v npx &> /dev/null; then
    echo "Starting web server on http://localhost:8080"
    echo "Press Ctrl+C to stop the server"
    npx http-server -p 8080
else
    echo "No suitable web server found. Please install Python or Node.js"
    echo "Or use VS Code's Live Server extension"
fi
