from django.urls import path
from .views import SubjectListView, SubjectModulesView, ModulePDFsView, upload_pdf, delete_pdf, admin_purge_all_pdfs, get_subject_modules, get_module_pdfs

urlpatterns = [
    path('subjects/', SubjectListView.as_view(), name='subject-list'),
    path('subjects/<int:subject_id>/modules/', get_subject_modules, name='subject-modules'),
    path('modules/<int:module_id>/pdfs/', get_module_pdfs, name='module-pdfs'),
    path('pdfs/<int:pk>/', delete_pdf, name='delete-pdf'),
    path('admin-purge-all-pdfs/', admin_purge_all_pdfs, name='admin-purge'),
    path('upload/', upload_pdf, name='upload-pdf'),
]
