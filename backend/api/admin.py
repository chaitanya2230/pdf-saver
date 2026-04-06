from django.contrib import admin
from .models import Subject, Module, PDF

@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)

@admin.register(Module)
class ModuleAdmin(admin.ModelAdmin):
    list_display = ('id', 'subject', 'module_number')
    list_filter = ('subject',)

@admin.register(PDF)
class PDFAdmin(admin.ModelAdmin):
    list_display = ('id', 'module', 'pdf_type', 'uploaded_at')
    list_filter = ('pdf_type', 'module__subject')
