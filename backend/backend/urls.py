import os
from pathlib import Path
from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
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
    # 1. Admin and API routes (Required for backend functionality)
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    
    # 2. MANDATORY: Assets route (Required for React CSS/JS to be found!)
    re_path(r'^assets/(?P<path>.*)$', serve, {'document_root': os.path.join(FRONTEND_DIR, 'assets')}),
    path('favicon.svg', serve, {'document_root': FRONTEND_DIR, 'path': 'favicon.svg'}),
    path('icons.svg', serve, {'document_root': FRONTEND_DIR, 'path': 'icons.svg'}),

    # 3. Your "Magic Line" from the snippet (for React Router)
    re_path(r'^.*$', TemplateView.as_view(template_name='index.html')),
    
    # 4. Your "Direct Root Serving" from the snippet
    path('', serve_react),
    
    # 5. Final React Router fallback (Your snippet's last line)
    re_path(r'^.*$', serve_react),
]
