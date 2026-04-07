import os
import sys
from pathlib import Path

# Add the 'backend' folder to the Python Path
# This allows Vercel to find the 'backend' package
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(BASE_DIR / "backend"))

# Import the WSGI application from Django
# Correct path to backend folder -> backend subfolder -> wsgi file
from backend.wsgi import application

# For Vercel, the function name must be 'app'
app = application
