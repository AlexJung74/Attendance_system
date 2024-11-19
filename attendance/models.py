# attendance/models.py

from datetime import date, timedelta

from django.contrib.auth.models import User
from django.db import models


# Student 모델
class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    student_id = models.CharField(max_length=10)
    DOB = models.DateField()
    # classes 필드 추가
    classes = models.ManyToManyField('Class', through='ClassStudent', related_name='students')

    def __str__(self):
        return f"{self.student_id} - {self.user.get_full_name()}"


# Lecturer 모델
class Lecturer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    staff_id = models.CharField(max_length=10)
    DOB = models.DateField()

    def __str__(self):
        return self.user.get_full_name()


# Semester 모델
class Semester(models.Model):
    YEAR_CHOICES = [(year, year) for year in range(2000, 2051)]
    SEMESTER_CHOICES = [('Sem1', 'Semester1'), ('Sem2', 'Semester2')]

    year = models.IntegerField(choices=YEAR_CHOICES)
    semester = models.CharField(max_length=10, choices=SEMESTER_CHOICES)

    class Meta:
        unique_together = ('year', 'semester')

    def __str__(self):
        return f"{self.year} {self.get_semester_display()}"


# Course 모델
class Course(models.Model):
    code = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


# Class 모델
class Class(models.Model):
    number = models.CharField(max_length=10)
    course = models.ForeignKey('Course', related_name='classes', on_delete=models.CASCADE)
    semester = models.ForeignKey('Semester', on_delete=models.CASCADE)
    lecturer = models.ForeignKey(Lecturer, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('course', 'semester', 'number')

    def __str__(self):
        try:
            semester_str = str(self.semester)
        except Semester.DoesNotExist:
            semester_str = 'Unknown Semester'
        try:
            course_code = self.course.code
            course_name = self.course.name
        except Course.DoesNotExist:
            course_code = 'Unknown Code'
            course_name = 'Unknown Course'
        return f"({semester_str}) - {course_code} {course_name} - Class {self.number}"

    @property
    def total_classes(self):
        return self.college_days.count()

    @total_classes.setter
    def total_classes(self, value):
        self._total_classes = value

    def create_college_days(self):
        # 시작 날짜와 종료 날짜 설정
        semester_months = {
            'Sem1': (3, 6),
            'Sem2': (8, 11),
        }
        start_month, end_month = semester_months.get(self.semester.semester, (1, 12))
        start_date = date(self.semester.year, start_month, 1)
        end_date = date(self.semester.year, end_month, 28)  # 월별 마지막 날짜를 정확히 계산하려면 calendar 모듈 사용

        # 수업 요일 설정 (예: 매주 월요일과 수요일)
        class_days_of_week = [0, 2]  # 0=월요일, 2=수요일

        current_date = start_date
        while current_date <= end_date:
            if current_date.weekday() in class_days_of_week:
                CollegeDay.objects.get_or_create(date=current_date, class_instance=self)
            current_date += timedelta(days=1)


# ClassStudent 중간 테이블 명시적 정의
class ClassStudent(models.Model):
    student = models.ForeignKey('Student', on_delete=models.CASCADE)
    class_instance = models.ForeignKey('Class', on_delete=models.CASCADE)

    class Meta:
        unique_together = ('student', 'class_instance')

    def __str__(self):
        return f"{self.student} in {self.class_instance}"


# CollegeDay 모델
class CollegeDay(models.Model):
    date = models.DateField()
    class_instance = models.ForeignKey(Class, on_delete=models.CASCADE, related_name='college_days')

    class Meta:
        unique_together = ('date', 'class_instance')

    def __str__(self):
        return f"{self.class_instance} on {self.date}"


# Attendance 모델
class Attendance(models.Model):
    STATUS_CHOICES = [
        ('P', 'Present'),
        ('A', 'Absent'),
        ('L', 'Late'),
        ('E', 'Excused'),
    ]

    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    class_instance = models.ForeignKey(Class, on_delete=models.CASCADE)
    date = models.DateField()
    status = models.CharField(max_length=1, choices=STATUS_CHOICES, default='D')

    class Meta:
        unique_together = ('student', 'class_instance', 'date')

    def __str__(self):
        return f"{self.student} - {self.class_instance} on {self.date}: {self.get_status_display()}"
