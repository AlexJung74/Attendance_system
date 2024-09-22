# Create your tests here.
from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth import get_user_model
from .models import Student, Lecturer, Class, Course, Semester, Attendance
from .forms import UserRegistrationForm, StudentForm, LecturerForm, ClassForm, ExcelUploadForm

User = get_user_model()


class UserModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass')

    def test_user_creation(self):
        self.assertEqual(self.user.username, 'testuser')
        self.assertTrue(self.user.check_password('testpass'))


class StudentModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='studentuser', password='testpass')
        self.student = Student.objects.create(user=self.user, student_id='S001', DOB='2000-01-01')

    def test_student_creation(self):
        self.assertEqual(self.student.user.username, 'studentuser')
        self.assertEqual(self.student.student_id, 'S001')
        self.assertEqual(str(self.student.DOB), '2000-01-01')


class LecturerModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='lectureruser', password='testpass')
        self.lecturer = Lecturer.objects.create(user=self.user, staff_id='L001', DOB='1980-01-01')

    def test_lecturer_creation(self):
        self.assertEqual(self.lecturer.user.username, 'lectureruser')
        self.assertEqual(self.lecturer.staff_id, 'L001')
        self.assertEqual(str(self.lecturer.DOB), '1980-01-01')


class ClassModelTest(TestCase):
    def setUp(self):
        self.course = Course.objects.create(code='C001', name='Test Course')
        self.semester = Semester.objects.create(year=2024, semester='Spring')
        self.user = User.objects.create_user(username='lectureruser', password='testpass')
        self.lecturer = Lecturer.objects.create(user=self.user, staff_id='L001', DOB='1980-01-01')
        self.class_instance = Class.objects.create(number=1, course=self.course, semester=self.semester, lecturer=self.lecturer)

    def test_class_creation(self):
        self.assertEqual(self.class_instance.course.name, 'Test Course')
        self.assertEqual(self.class_instance.semester.year, 2024)
        self.assertEqual(self.class_instance.lecturer.staff_id, 'L001')


class AttendanceModelTest(TestCase):
    def setUp(self):
        self.student_user = User.objects.create_user(username='studentuser', password='testpass')
        self.student = Student.objects.create(user=self.student_user, student_id='S001', DOB='2000-01-01')
        self.course = Course.objects.create(code='C001', name='Test Course')
        self.semester = Semester.objects.create(year=2024, semester='Spring')
        self.lecturer_user = User.objects.create_user(username='lectureruser', password='testpass')
        self.lecturer = Lecturer.objects.create(user=self.lecturer_user, staff_id='L001', DOB='1980-01-01')
        self.class_instance = Class.objects.create(number=1, course=self.course, semester=self.semester, lecturer=self.lecturer)
        self.attendance = Attendance.objects.create(student=self.student, class_instance=self.class_instance, date='2024-09-19', status='P')

    def test_attendance_creation(self):
        self.assertEqual(self.attendance.student.student_id, 'S001')
        self.assertEqual(self.attendance.class_instance.course.name, 'Test Course')
        self.assertEqual(str(self.attendance.date), '2024-09-19')
        self.assertEqual(self.attendance.status, 'P')


class UserRegistrationFormTest(TestCase):
    def test_registration_form(self):
        form_data = {
            'username': 'testuser',
            'password1': 'testpassword123',
            'password2': 'testpassword123',
            'email': 'test@example.com',
            'phone_number': '010-1234-5678'
        }
        form = UserRegistrationForm(data=form_data)
        self.assertTrue(form.is_valid())


class StudentFormTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='studentuser', password='testpass')

    def test_student_form(self):
        form_data = {
            'user': self.user.id,
            'student_id': 'S001',
            'DOB': '2000-01-01',
            'classes': []  # Empty classes list for now
        }
        form = StudentForm(data=form_data)
        self.assertTrue(form.is_valid())


class LecturerFormTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='lectureruser', password='testpass')

    def test_lecturer_form(self):
        form_data = {
            'user': self.user.id,
            'staff_id': 'L001',
            'DOB': '1980-01-01'
        }
        form = LecturerForm(data=form_data)
        self.assertTrue(form.is_valid())


class ClassFormTest(TestCase):
    def setUp(self):
        self.course = Course.objects.create(code='C001', name='Test Course')
        self.semester = Semester.objects.create(year=2024, semester='Spring')
        self.user = User.objects.create_user(username='lectureruser', password='testpass')
        self.lecturer = Lecturer.objects.create(user=self.user, staff_id='L001', DOB='1980-01-01')

    def test_class_form(self):
        form_data = {
            'number': 1,
            'course': self.course.id,
            'semester': self.semester.id,
            'lecturer': self.lecturer.id
        }
        form = ClassForm(data=form_data)
        self.assertTrue(form.is_valid())


class ExcelUploadFormTest(TestCase):
    def test_excel_upload_form(self):
        with open('test.xlsx', 'rb') as file:
            form_data = {'excel_file': file}
            form = ExcelUploadForm(data=form_data)
            self.assertFalse(form.is_valid())  # 실제로 업로드된 파일이 없으므로 유효성 검사 실패


class LoginViewTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.url = reverse('login')

    def test_login_view(self):
        response = self.client.post(self.url, {'username': 'testuser', 'password': 'testpass'})
        self.assertEqual(response.status_code, 302)  # 리디렉션 확인
        self.assertRedirects(response, reverse('dashboard'))


class DashboardViewTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.admin_user = User.objects.create_superuser(username='admin', password='adminpass')
        self.lecturer_user = User.objects.create_user(username='lectureruser', password='testpass')
        self.lecturer_group = self.lecturer_user.groups.create(name='Lecturer')
        self.student_user = User.objects.create_user(username='studentuser', password='testpass')
        self.student_group = self.student_user.groups.create(name='Student')

    def test_admin_dashboard_redirect(self):
        self.client.login(username='admin', password='adminpass')
        response = self.client.get(reverse('dashboard'))
        self.assertRedirects(response, reverse('admin-dashboard'))

    def test_lecturer_dashboard_redirect(self):
        self.client.login(username='lectureruser', password='testpass')
        response = self.client.get(reverse('dashboard'))
        self.assertRedirects(response, reverse('lecturer-dashboard'))

    def test_student_dashboard_redirect(self):
        self.client.login(username='studentuser', password='testpass')
        response = self.client.get(reverse('dashboard'))
        self.assertRedirects(response, reverse('student-attendance'))
