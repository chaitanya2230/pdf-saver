from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from .models import Subject, Module, PDF
from .serializers import SubjectSerializer, ModuleSerializer, PDFSerializer, ModuleWithPDFsSerializer

class SubjectListView(generics.ListAPIView):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer

class SubjectModulesView(generics.ListAPIView):
    serializer_class = ModuleWithPDFsSerializer

    def get_queryset(self):
        subject_id = self.kwargs['id']
        return Module.objects.filter(subject_id=subject_id).prefetch_related('pdfs')

class ModulePDFsView(generics.ListAPIView):
    serializer_class = PDFSerializer

    def get_queryset(self):
        module_id = self.kwargs['id']
        return PDF.objects.filter(module_id=module_id)

@api_view(['POST'])
def upload_pdf(request):
    serializer = PDFSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([AllowAny])
def admin_purge_all_pdfs(request):
    if request.headers.get('Admin-Auth') != "pdforganizer":
        return Response({"error": "Unauthorized Access Denied"}, status=status.HTTP_403_FORBIDDEN)
    
    deleted_count, _ = PDF.objects.all().delete()
    return Response({"message": f"Successfully wiped {deleted_count} cloud storage records!"})
