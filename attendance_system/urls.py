from django.contrib import admin
from django.urls import path, include
from attendance.views.home_views import home  # Import the home view for the main page

urlpatterns = [
    path('admin/', admin.site.urls),  # Django admin
    path('', home, name='home'),  # Home page

    path('attendance/', include('attendance.urls')),  # Include the URLs from the attendance app

    path('accounts/', include('django.contrib.auth.urls')),  # Django auth system (login/logout)
]
