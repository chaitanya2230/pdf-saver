#!/usr/bin/env bash
# Exit on error
set -o errexit

# 1. Build the React Frontend
echo "Building Frontend..."
cd frontend
npm install
npm run build
cd ..

# 2. Install Backend Dependencies
echo "Installing Requirements..."
pip install -r requirements.txt

# 3. Prepare Django
echo "Running Migrations and Static Collection..."
cd backend
python manage.py collectstatic --no-input
python manage.py migrate
echo "Build Complete!"
