from django.db import models

class Subject(models.Model):
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name

class Module(models.Model):
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='modules')
    module_number = models.IntegerField()

    class Meta:
        unique_together = ('subject', 'module_number')
        ordering = ['module_number']

    def __str__(self):
        return f"{self.subject.name} - Module {self.module_number}"

class PDF(models.Model):
    TYPE_CHOICES = (
        ('notes', 'Notes'),
        ('question_paper', 'Question Paper')
    )
    module = models.ForeignKey(Module, on_delete=models.CASCADE, related_name='pdfs')
    pdf_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    file_url = models.TextField()
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.module} - {self.get_pdf_type_display()} - {self.id}"
