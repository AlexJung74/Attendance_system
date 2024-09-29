# models.py (변경 없음)
# 주어진 모델은 적절하게 설정되어 있으며 변경 없이 사용 가능합니다.

# attendance/management/commands/generate_initial_data.py (수정된 부분 포함)

import random
from datetime import date, timedelta

from django.contrib.auth.models import User, Group
from django.core.management.base import BaseCommand

from attendance.models import Lecturer, Student, Course, Semester, Class, CollegeDay, ClassStudent


class Command(BaseCommand):
    help = 'Generate initial data for the Attendance system.'

    def handle(self, *args, **options):
        self.create_groups()
        self.create_users()
        self.create_courses()
        self.create_semesters()
        self.create_classes()
        self.create_college_days()
        self.assign_students_to_classes()
        self.stdout.write(self.style.SUCCESS('Initial data generated successfully.'))

    def create_groups(self):
        # 그룹 생성
        groups = ['Admin', 'Lecturers', 'Students']
        for group in groups:
            Group.objects.get_or_create(name=group)

    def create_users(self):
        # 사용자 비밀번호 (평문으로 설정)
        default_password = "asdd1233"

        # 일반적으로 사용되는 이름
        first_names = [
            'John', 'Jane', 'Michael', 'Emily', 'David', 'Emma', 'Chris', 'Olivia', 'James', 'Sophia',
            'Daniel', 'Ava', 'Matthew', 'Isabella', 'Andrew', 'Mia', 'Joseph', 'Charlotte', 'Ethan', 'Amelia'
        ]
        last_names = [
            'Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor',
            'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson', 'Garcia', 'Martinez', 'Robinson'
        ]

        # 관리자 그룹 가져오기
        admin_group = Group.objects.get(name='Admin')
        lecturer_group = Group.objects.get(name='Lecturers')
        student_group = Group.objects.get(name='Students')

        # 관리자 생성
        if not User.objects.filter(username='admin').exists():
            admin_user = User.objects.create_superuser(
                username='admin',
                password='asdd1233',
                email='zend74@gmail.com',
                first_name='Admin',
                last_name='User'
            )
            admin_user.groups.add(admin_group)

        # 강사 생성
        for i in range(1, 7):
            username = f'le{i}'
            first_name = random.choice(first_names)
            last_name = random.choice(last_names)
            staff_id = f'L00{i}'
            if not User.objects.filter(username=username).exists():
                user = User.objects.create_user(
                    username=username,
                    password=default_password,
                    email=f'{username}@example.com',
                    first_name=first_name,
                    last_name=last_name
                )
                # 강사 그룹에 추가
                user.groups.add(lecturer_group)
                Lecturer.objects.create(user=user, staff_id=staff_id, DOB='1980-01-01')

        # 학생 생성
        for i in range(1, 51):
            username = f'st{i}'
            first_name = random.choice(first_names)
            last_name = random.choice(last_names)
            student_id = f'S00{i}'
            if not User.objects.filter(username=username).exists():
                user = User.objects.create_user(
                    username=username,
                    password=default_password,
                    email=f'{username}@example.com',
                    first_name=first_name,
                    last_name=last_name
                )
                # 학생 그룹에 추가
                user.groups.add(student_group)
                Student.objects.create(user=user, student_id=student_id, DOB='2000-01-01')

    def create_courses(self):
        course_names = [
            'Introduction to Programming',
            'Data Structures and Algorithms',
            'Database Management Systems',
            'Web Development with Django',
            'Machine Learning Fundamentals',
            'Artificial Intelligence',
            'Computer Networks',
            'Software Engineering',
            'Operating Systems',
            'Cloud Computing'
        ]

        for index, course_name in enumerate(course_names, start=1):
            code = f'COURSE{index}'
            Course.objects.get_or_create(name=course_name, code=code)

    def create_semesters(self):
        years = [2022, 2023, 2024]
        for year in years:
            Semester.objects.get_or_create(year=year, semester='Sem1')
            Semester.objects.get_or_create(year=year, semester='Sem2')

    def create_classes(self):
        courses = Course.objects.all()
        lecturers = Lecturer.objects.all()
        semesters = Semester.objects.all()

        for course in courses:
            for semester in semesters:
                num_classes = random.randint(1, 2)  # 한 학기당 1~2개의 수업 생성
                for i in range(1, num_classes + 1):
                    lecturer = random.choice(lecturers)
                    class_number = i
                    if not Class.objects.filter(course=course, semester=semester, number=class_number).exists():
                        Class.objects.create(course=course, semester=semester, lecturer=lecturer, number=class_number)

    def create_college_days(self):
        classes = Class.objects.all()
        for class_instance in classes:
            if 'Sem1' in class_instance.semester.semester:
                start_date = date(class_instance.semester.year, 3, 1)
                end_date = date(class_instance.semester.year, 6, 30)
            else:
                start_date = date(class_instance.semester.year, 8, 1)
                end_date = date(class_instance.semester.year, 11, 30)

            current_date = start_date
            while current_date <= end_date:
                if current_date.weekday() < 5:  # 월요일부터 금요일만
                    if not CollegeDay.objects.filter(date=current_date, class_instance=class_instance).exists():
                        CollegeDay.objects.create(date=current_date, class_instance=class_instance)
                # 매달 1개씩 임의의 평일을 설정
                current_date += timedelta(days=random.randint(7, 10))

    def assign_students_to_classes(self):
        students = Student.objects.all()
        classes = list(Class.objects.all())

        for student in students:
            # 각 학생을 랜덤한 2개의 클래스에 할당
            if len(classes) < 2:
                assigned_classes = classes
            else:
                assigned_classes = random.sample(classes, 2)
            for class_instance in assigned_classes:
                ClassStudent.objects.get_or_create(student=student, class_instance=class_instance)
            self.stdout.write(f"Assigned {student} to classes: {[c.number for c in assigned_classes]}")
