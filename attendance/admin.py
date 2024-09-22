from django.contrib import admin
from .models import Student, Lecturer, Semester, Course, Class, CollegeDay, Attendance
# Register your models here.

admin.site.register(Student)
admin.site.register(Lecturer)
admin.site.register(Semester)
admin.site.register(Course)
admin.site.register(Class)
admin.site.register(CollegeDay)
admin.site.register(Attendance)
