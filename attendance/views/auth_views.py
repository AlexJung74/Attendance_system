# attendance/views/auth_views.py
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework import status


class CustomAuthToken(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        user = User.objects.get(username=request.data['username'])

        # 추가적인 역할 정보를 포함
        response.data.update({
            'is_superuser': user.is_superuser,
            'is_lecturer': user.groups.filter(name='Lecturers').exists(),
            'is_student': user.groups.filter(name='Students').exists(),
        })
        return response
