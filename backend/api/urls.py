from django.urls import path
from .views import SubjectListView, SubjectModulesView, ModulePDFsView, upload_pdf

urlpatterns = [
    path('subjects/', SubjectListView.as_view(), name='subject-list'),
    path('subjects/<int:id>/modules/', SubjectModulesView.as_view(), name='subject-modules'),
    path('modules/<int:id>/pdfs/', ModulePDFsView.as_view(), name='module-pdfs'),
    path('upload/', upload_pdf, name='upload-pdf'),
]
