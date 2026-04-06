import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from api.models import Subject, Module

subjects_list = [
    'Operating Systems (OS)',
    'Mathematics (Maths)',
    'Database Management Systems (DBMS)',
    'Formal Languages and Automata Theory (FLAT)',
    'Managerial Economics and Financial Analysis (MEFA)'
]

for sub_name in subjects_list:
    subject, created = Subject.objects.get_or_create(name=sub_name)
    if created:
        print(f"Created subject: {subject.name}")
    for i in range(1, 6):
        mod, mod_created = Module.objects.get_or_create(subject=subject, module_number=i)
        if mod_created:
            print(f"  - Created Module {i}")
