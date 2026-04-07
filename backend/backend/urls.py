import os
from pathlib import Path
from django.contrib import admin
from django.urls import path, include, re_path
from django.shortcuts import render
from django.views.static import serve

# Path to the React production build
BASE_DIR = Path(__file__).resolve().parent.parent
FRONTEND_DIR = os.path.join(BASE_DIR.parent, 'frontend', 'dist')

# A super direct view to serve your React index.html
def serve_react(request):
    """Serve the root React index.html file."""
    return render(request, 'index.html')

urlpatterns = [
    # Admin and API routes first
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    
    # Static Assets (Mandatory for Vite frontend to find JS/CSS/Images)
    # These must be listed before the catch-all pattern
    re_path(r'^assets/(?P<path>.*)$', serve, {'document_root': os.path.join(FRONTEND_DIR, 'assets')}),
    path('favicon.svg', serve, {'document_root': FRONTEND_DIR, 'path': 'favicon.svg'}),
    path('icons.svg', serve, {'document_root': FRONTEND_DIR, 'path': 'icons.svg'}),

    # Catch EVERYTHING else (handles Root and individual React-Router subpages like /subject/1)
    re_path(r'^.*$', serve_react),
]
