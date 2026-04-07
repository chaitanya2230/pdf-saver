#!/usr/bin/env bash
# Exit on error
set -o errexit

# Detect if we are inside the backend folder or at the root
if [ -d "../frontend" ]; then
    # We are at the Root
    BUILD_ROOT="."
    FRONTEND_DIR="./frontend"
    BACKEND_DIR="./backend"
elif [ -d "../../frontend" ]; then
    # We are inside Backend
    BUILD_ROOT=".."
    FRONTEND_DIR="../../frontend"
    BACKEND_DIR="."
else
    # Fallback to current dir assuming standard layout
    echo "Warning: Could not detect root correctly. Using current directory."
    BUILD_ROOT="."
    FRONTEND_DIR="../frontend"
    BACKEND_DIR="."
fi

# 1. Build the React Frontend
echo "Building Frontend in $FRONTEND_DIR..."
cd "$FRONTEND_DIR"
npm install
npm run build
cd "$BUILD_ROOT"

# 2. Install Backend Dependencies
echo "Installing Requirements..."
cd "$BACKEND_DIR"
pip install -r requirements.txt

# 3. Prepare Django
echo "Running Migrations and Static Collection..."
python manage.py collectstatic --no-input
python manage.py migrate
echo "Build Complete!"
