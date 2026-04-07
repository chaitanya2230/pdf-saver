import os
from django.contrib import admin
from django.urls import path, include, re_path
from django.shortcuts import render
from django.views.static import serve
from pathlib import Path

# Path to the React production build
BASE_DIR = Path(__file__).resolve().parent.parent
FRONTEND_DIR = os.path.join(BASE_DIR.parent, 'frontend', 'dist')

# A super direct view to serve your React index.html
def serve_react(request):
    return render(request, 'index.html')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    
    # Serve React Assets manually since they aren't prefixed with /static/
    # This is essential for Vite builds on Render
    re_path(r'^assets/(?P<path>.*)$', serve, {'document_root': os.path.join(FRONTEND_DIR, 'assets')}),
    path('favicon.svg', serve, {'document_root': FRONTEND_DIR, 'path': 'favicon.svg'}),
    path('icons.svg', serve, {'document_root': FRONTEND_DIR, 'path': 'icons.svg'}),

    # Direct Root Serving
    path('', serve_react),
    
    # Catch everything else (for React Router)
    re_path(r'^.*$', serve_react),
]
