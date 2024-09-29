# attendance/views/home_views.py

from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import AuthenticationForm
from django.shortcuts import render, redirect
from django.urls import reverse

from attendance.utils import redirect_to_dashboard
from attendance.models import Class
import logging

logger = logging.getLogger(__name__)


def home(request):
    if request.user.is_authenticated:
        logger.info(f"User {request.user.username} is authenticated, redirecting to dashboard.")
        return redirect('dashboard')
    else:
        logger.info("User is not authenticated, showing login page.")
        return redirect('login')  # 로그인되지 않은 경우 로그인 페이지로 리디렉션


@login_required
def dashboard(request):
    return redirect_to_dashboard(request, request.user)


@login_required
def class_list(request):
    if request.user.is_superuser:
        classes = Class.objects.all()
    else:
        classes = Class.objects.filter(lecturer__user=request.user)
    return render(request, 'class_list.html', {'classes': classes})
