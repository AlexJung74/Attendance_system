# attendance/views/forms.py

from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from .models import Student, Lecturer, Class, Attendance


# 사용자 등록 폼 (기본 Django UserCreationForm 확장)
class UserRegistrationForm(UserCreationForm):
    email = forms.EmailField(required=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password1', 'password2']


# 학생 정보 생성 및 수정 폼
class StudentForm(forms.ModelForm):
    class Meta:
        model = Student
        fields = ['user', 'student_id', 'DOB', 'classes']
        widgets = {
            'DOB': forms.DateInput(attrs={'type': 'date'}),
            'classes': forms.CheckboxSelectMultiple(),
        }


# 강사 정보 생성 및 수정 폼
class LecturerForm(forms.ModelForm):
    class Meta:
        model = Lecturer
        fields = ['user', 'staff_id', 'DOB']  # 관련 필드 정의
        widgets = {
            'DOB': forms.DateInput(attrs={'type': 'date'}),  # DatePicker 위젯 사용
        }


# 수업 생성 및 수정 폼
class ClassForm(forms.ModelForm):
    class Meta:
        model = Class
        fields = ['number', 'course', 'semester', 'lecturer']
        widgets = {
            'semester': forms.Select(),
            'course': forms.Select(),
            'lecturer': forms.Select(),
        }


# 출석 정보 수정 폼 (강사 및 관리자가 출석 상태를 변경할 때 사용)
class AttendanceForm(forms.ModelForm):
    class Meta:
        model = Attendance
        fields = ['student', 'class_instance', 'date', 'status']  # 출석 필드 정의
        widgets = {
            'date': forms.DateInput(attrs={'type': 'date'}),  # DatePicker 위젯 사용
        }


# 엑셀 파일 업로드 폼 (관리자가 학생 정보를 엑셀로 업로드할 때 사용)
class ExcelUploadForm(forms.Form):
    excel_file = forms.FileField()

    def clean_excel_file(self):
        file = self.cleaned_data.get('excel_file')
        if file:
            if not file.name.endswith('.xlsx') and not file.name.endswith('.xls'):
                raise forms.ValidationError("This is not an Excel file.")
        return file
