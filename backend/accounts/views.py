from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework import status

from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes, force_str
from django.utils.http import (
    urlsafe_base64_encode,
    urlsafe_base64_decode,
)

import json
import urllib.request
import urllib.error

from .models import User, StudentProfile
from .serializers import (
    RegisterSerializer,
    LoginSerializer,
    UserSerializer,
    UserProfileUpdateSerializer,
    ChangePasswordSerializer,
    WardenCreateSerializer,
    AdminStudentCreateSerializer,
)
from .permissions import IsAdminUserRole, IsWarden

def send_brevo_email(to_email, subject, html_content):
    url = "https://api.brevo.com/v3/smtp/email"

    payload = {
        "sender": {
            "name": "Student HelpDesk",
            "email": settings.BREVO_SENDER_EMAIL
        },
        "to": [
            {"email": to_email}
        ],
        "subject": subject,
        "htmlContent": html_content
    }

    request = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "accept": "application/json",
            "api-key": settings.BREVO_API_KEY,
            "content-type": "application/json"
        },
        method="POST"
    )

    try:
        with urllib.request.urlopen(request, timeout=20) as response:
            return 200 <= response.status < 300

    except (urllib.error.HTTPError, urllib.error.URLError) as error:
        print("Brevo email error:", error)
        return False

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()

            # Newly registered students must verify their email.
            user.is_email_verified = False
            user.save(update_fields=['is_email_verified'])

            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)

            frontend_url = settings.FRONTEND_URL.rstrip('/')

            verification_link = (
                f"{frontend_url}/verify-email/{uid}/{token}"
            )

            html_content = f"""
                <h2>Welcome to Student HelpDesk!</h2>
                <p>Thank you for registering.</p>
                <p>Please verify your email address by clicking below:</p>
                <a href="{verification_link}">
                    Verify My Email
                </a>
                <p>If you did not create this account, ignore this email.</p>
            """

            email_sent = send_brevo_email(
                user.email,
                "Verify Your Student HelpDesk Account",
                html_content
            )

            if not email_sent:
                return Response(
                    {
                        "message": (
                            "Your account was created, but we could not "
                            "send the verification email. Please contact "
                            "the administrator."
                        )
                    },
                    status=status.HTTP_503_SERVICE_UNAVAILABLE
                )

            return Response(
                {
                    "message": (
                        "Registration successful! Please check your email "
                        "and verify your account before logging in."
                    ),
                    "email": user.email
                },
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

class VerifyEmailView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        uid = request.data.get('uid')
        token = request.data.get('token')

        if not uid or not token:
            return Response(
                {"message": "Invalid verification link."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user_id = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(pk=user_id, is_active=True)

        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response(
                {"message": "Invalid or expired verification link."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not default_token_generator.check_token(user, token):
            return Response(
                {"message": "Invalid or expired verification link."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not user.is_email_verified:
            user.is_email_verified = True
            user.save(update_fields=['is_email_verified'])

        return Response(
            {
                "message": (
                    "Your email has been verified successfully. "
                    "You can now log in."
                )
            },
            status=status.HTTP_200_OK
        )

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.validated_data['user']

            token, created = Token.objects.get_or_create(user=user)

            return Response(
                {
                    "token": token.key,
                    "user": UserSerializer(user).data,
                    "message": "Login successful."
                },
                status=status.HTTP_200_OK
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
    

class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            request.user.auth_token.delete()
        except Exception:
            pass

        return Response(
            {'message': 'Logged out successfully.'},
            status=status.HTTP_200_OK
        )


class UserProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        serializer = UserProfileUpdateSerializer(
            request.user,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            user = serializer.save()

            return Response(
                {
                    'user': UserSerializer(user).data,
                    'message': 'Profile updated successfully.'
                }
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


class ChangePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)

        if serializer.is_valid():
            user = request.user

            if not user.check_password(
                serializer.validated_data['old_password']
            ):
                return Response(
                    {
                        'old_password': [
                            'Incorrect current password.'
                        ]
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            user.set_password(
                serializer.validated_data['new_password']
            )
            user.save()

            return Response(
                {'message': 'Password changed successfully.'},
                status=status.HTTP_200_OK
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


class ForgotPasswordView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email', '').strip()

        user = User.objects.filter(
            email__iexact=email,
            is_active=True,
            is_email_verified=True
        ).first()

        if user:
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)

            frontend_url = settings.FRONTEND_URL.rstrip('/')

            reset_link = (
                f"{frontend_url}/reset-password/{uid}/{token}"
            )

            html_content = f"""
                <h2>Password Reset</h2>
                <p>We received a request to reset your password.</p>
                <a href="{reset_link}">Reset My Password</a>
                <p>If you did not request this, ignore this email.</p>
            """

            email_sent = send_brevo_email(
                user.email,
                "Student HelpDesk Password Reset",
                html_content
            )

            if not email_sent:
                return Response(
                    {"message": "Unable to send password reset email."},
                    status=status.HTTP_503_SERVICE_UNAVAILABLE
                )

        return Response(
            {
                "message": (
                    "If an eligible account exists for this email, "
                    "a password reset link has been sent."
                )
            },
            status=status.HTTP_200_OK
        )

class ResetPasswordView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        uid = request.data.get('uid')
        token = request.data.get('token')
        new_password = request.data.get('new_password')
        confirm_password = request.data.get('confirm_password')

        if not uid or not token:
            return Response(
                {'detail': 'Invalid password reset link.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not new_password or not confirm_password:
            return Response(
                {
                    'detail':
                        'Both password fields are required.'
                },
                status=status.HTTP_400_BAD_REQUEST
            )


        if new_password != confirm_password:
            return Response(
                {
                    'confirm_password': [
                        'Passwords do not match.'
                    ]
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        if len(new_password) < 6:
            return Response(
                {
                    'new_password': [
                        'Password must be at least 6 characters.'
                    ]
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user_id = force_str(
                urlsafe_base64_decode(uid)
            )

            user = User.objects.get(
                pk=user_id,
                is_active=True
            )

        except (
            TypeError,
            ValueError,
            OverflowError,
            User.DoesNotExist
        ):
            return Response(
                {'detail': 'Invalid password reset link.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not user.is_email_verified:
            return Response(
                {"message": "Please verify your email before resetting your password."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        if not default_token_generator.check_token(
            user,
            token
        ):
            return Response(
                {
                    'detail':
                        'This password reset link is invalid '
                        'or has expired.'
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(new_password)
        user.save()

        # Revoke existing authentication tokens.
        Token.objects.filter(user=user).delete()

        return Response(
            {
                'message':
                    'Password reset successfully. '
                    'You can now sign in.'
            },
            status=status.HTTP_200_OK
        )


class StudentListView(APIView):
    permission_classes = [
        permissions.IsAuthenticated,
        IsWarden
    ]

    def get(self, request):
        query = request.query_params.get(
            'search',
            ''
        ).strip()

        students = (
            User.objects
            .filter(role='STUDENT')
            .select_related('student_profile')
            .order_by('-date_joined')
        )

        if query:
            students = students.filter(
                Q(username__icontains=query) |
                Q(first_name__icontains=query) |
                Q(last_name__icontains=query) |
                Q(email__icontains=query) |
                Q(
                    student_profile__roll_number__icontains=query
                ) |
                Q(
                    student_profile__hostel__icontains=query
                ) |
                Q(
                    student_profile__department__icontains=query
                )
            )

        serializer = UserSerializer(
            students,
            many=True
        )

        return Response(serializer.data)


class UserToggleActiveView(APIView):
    permission_classes = [
        permissions.IsAuthenticated,
        IsAdminUserRole
    ]

    def post(self, request, pk):
        target_user = get_object_or_404(
            User,
            pk=pk
        )

        if target_user.is_superuser:
            return Response(
                {
                    'error':
                        'Cannot disable superuser.'
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        target_user.is_active = not target_user.is_active
        target_user.save()

        return Response(
            {
                'id': target_user.id,
                'is_active': target_user.is_active,
                'message': (
                    'User account '
                    f"{'activated' if target_user.is_active else 'deactivated'}."
                )
            }
        )


class AdminWardenListCreateView(APIView):
    permission_classes = [
        permissions.IsAuthenticated,
        IsAdminUserRole
    ]

    def get(self, request):
        wardens = (
            User.objects
            .filter(role='WARDEN')
            .order_by('-date_joined')
        )

        serializer = UserSerializer(
            wardens,
            many=True
        )

        return Response(serializer.data)

    def post(self, request):
        serializer = WardenCreateSerializer(
            data=request.data
        )

        if serializer.is_valid():
            user = serializer.save()

            return Response(
                {
                    'user': UserSerializer(user).data,
                    'message':
                        'Warden account created successfully.'
                },
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


class AdminStudentCreateView(APIView):
    permission_classes = [
        permissions.IsAuthenticated,
        IsAdminUserRole
    ]

    def post(self, request):
        serializer = AdminStudentCreateSerializer(
            data=request.data
        )

        if serializer.is_valid():
            user = serializer.save()

            return Response(
                {
                    'user': UserSerializer(user).data,
                    'message':
                        'Student account created successfully.'
                },
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
  