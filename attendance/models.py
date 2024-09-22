# attendance/models.py
# from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import User
from django.db import models


# User 모델
# class User(AbstractUser):
#    phone_number = models.CharField(max_length=15, blank=True, null=True)

#    def __str__(self):
#        return self.username


# Student 모델
class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student')
    student_id = models.CharField(max_length=20, unique=True)
    DOB = models.DateField()  # Date of Birth
    classes = models.ManyToManyField('Class', related_name='students')  # 학생과 수업 간의 다대다 관계

    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name} - {self.student_id}"

    class Meta:
        # 커스텀 권한이 필요 없음.
        pass


# Lecturer 모델
class Lecturer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='lecturer')
    staff_id = models.CharField(max_length=20, unique=True)
    DOB = models.DateField()

    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name} - {self.staff_id}"


# Semester 모델
class Semester(models.Model):
    year = models.IntegerField()
    semester = models.CharField(max_length=10)

    def __str__(self):
        return f"{self.year} {self.semester}"


# Course 모델
class Course(models.Model):
    code = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


# Class 모델
class Class(models.Model):
    number = models.IntegerField()
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='classes')
    semester = models.ForeignKey(Semester, on_delete=models.CASCADE, related_name='classes')
    lecturer = models.ForeignKey(Lecturer, on_delete=models.CASCADE, related_name='classes')

    def __str__(self):
        return f"{self.course.name} - Class {self.number} ({self.semester})"


# CollegeDay 모델
class CollegeDay(models.Model):
    date = models.DateField()
    class_obj = models.ForeignKey(Class, on_delete=models.CASCADE, related_name='college_days')

    def __str__(self):
        return f"{self.class_obj} on {self.date}"


# Attendance 모델
class Attendance(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='attendances')
    class_instance = models.ForeignKey(Class, on_delete=models.CASCADE, related_name='attendances')
    date = models.DateField()
    status_choices = [
        ('P', 'Present'),
        ('A', 'Absent'),
        ('L', 'Late'),
        ('E', 'Excused'),
    ]
    status = models.CharField(max_length=1, choices=status_choices)

    def __str__(self):
        return f"{self.student} - {self.class_instance} - {self.date}: {self.get_status_display()}"
