from django.views.generic import ListView
from django.contrib.auth.mixins import LoginRequiredMixin
from ..models import Attendance


# 학생 출석 정보 뷰
class StudentAttendanceView(LoginRequiredMixin, ListView):
    model = Attendance
    template_name = 'attendance/../../templates/student/student_attendance.html'
    context_object_name = 'attendances'

    def get_queryset(self):
        # 로그인된 사용자의 student 속성을 이용하여 해당 학생의 출석 정보만 필터링
        user = self.request.user
        return Attendance.objects.filter(student__user=user)  # student의 user가 현재 로그인된 사용자와 일치하는지 확인

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'My Attendance Records'  # 템플릿에 사용할 추가적인 컨텍스트 데이터
        return context
