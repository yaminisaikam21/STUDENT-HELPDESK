from django.urls import path

from .views import (
    RegisterView,
    LoginView,
    LogoutView,
    UserProfileView,
    ChangePasswordView,
    ForgotPasswordView,
    ResetPasswordView,
    StudentListView,
    UserToggleActiveView,
    AdminWardenListCreateView,
    AdminStudentCreateView,
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),

    path('profile/', UserProfileView.as_view(), name='profile'),
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),

    path('forgot-password/', ForgotPasswordView.as_view(), name='forgot_password'),
    path('reset-password/', ResetPasswordView.as_view(), name='reset_password'),

    path('students/', StudentListView.as_view(), name='students_list'),

    path(
        'students/create/',
        AdminStudentCreateView.as_view(),
        name='admin_student_create'
    ),
    
    path(
        'wardens/',
        AdminWardenListCreateView.as_view(),
        name='admin_wardens'
    ),

    path(
        'users/<int:pk>/toggle-active/',
        UserToggleActiveView.as_view(),
        name='user_toggle_active'
    ),
]