from rest_framework import serializers
from .models import Subject, Module, PDF

class PDFSerializer(serializers.ModelSerializer):
    class Meta:
        model = PDF
        fields = ['id', 'module', 'pdf_type', 'file_url', 'uploaded_at']

class ModuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Module
        fields = ['id', 'subject', 'module_number']

class ModuleWithPDFsSerializer(serializers.ModelSerializer):
    pdfs = PDFSerializer(many=True, read_only=True)
    class Meta:
        model = Module
        fields = ['id', 'subject', 'module_number', 'pdfs']

class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ['id', 'name']
