import form
from django.contrib.auth.forms import AuthenticationForm
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from ..utils import redirect_user_based_on_role


# 홈 페이지 뷰 (로그인 화면)
def home(request):
    if request.user.is_authenticated:
        # 로그인한 경우, 권한에 따라 대시보드로 리디렉션
        return redirect('dashboard')
    else:
        form = AuthenticationForm()
    return render(request, 'attendance/../../templates/registration/login.html', {'form': form})  # 로그인 템플릿 렌더링


# 로그인 후 사용자 권한에 따라 대시보드로 리디렉션
@login_required
def dashboard(request):
    return redirect_user_based_on_role(request.user)
