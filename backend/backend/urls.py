from django.contrib import admin
from django.urls import path, include, re_path
from django.shortcuts import render

# A super direct view to serve your React index.html
def serve_react(request):
    return render(request, 'index.html')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    
    # Direct Root Serving
    path('', serve_react),
    
    # Catch everything else (for React Router)
    re_path(r'^.*$', serve_react),
]
