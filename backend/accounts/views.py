from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token

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


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()

            token, _ = Token.objects.get_or_create(user=user)
            user_data = UserSerializer(user).data

            return Response(
                {
                    'token': token.key,
                    'user': user_data,
                    'message': 'Student registration successful.'
                },
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.validated_data['user']

            token, _ = Token.objects.get_or_create(user=user)
            user_data = UserSerializer(user).data

            return Response(
                {
                    'token': token.key,
                    'user': user_data,
                    'message': (
                        f'Welcome back, '
                        f'{user.first_name or user.username}!'
                    )
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

        if not email:
            return Response(
                {'email': ['Email is required.']},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = User.objects.filter(
            email__iexact=email,
            is_active=True
        ).first()

        # Do not reveal whether an email is registered.
        if not user:
            return Response(
                {
                    'message': (
                        'If an account exists with this email, '
                        'a password reset link has been sent.'
                    )
                },
                status=status.HTTP_200_OK
            )

        # Create secure Django reset token.
        uid = urlsafe_base64_encode(
            force_bytes(user.pk)
        )

        token = default_token_generator.make_token(user)

        # Create frontend reset link.
        reset_link = (
            f"{settings.FRONTEND_URL}"
            f"/reset-password/{uid}/{token}"
        )

        # Brevo email data.
        email_data = {
            "sender": {
                "name": "Student HelpDesk",
                "email": settings.BREVO_SENDER_EMAIL
            },
            "to": [
                {
                    "email": user.email
                }
            ],
            "subject": "Student HelpDesk - Password Reset",
            "htmlContent": f"""
                <div style="
                    font-family: Arial, sans-serif;
                    max-width: 600px;
                    margin: auto;
                    padding: 30px;
                    background: #f7f1e8;
                    border-radius: 12px;
                ">

                    <h2 style="color: #3A2A20;">
                        Student HelpDesk
                    </h2>

                    <p>
                        Hello {user.first_name or user.username},
                    </p>

                    <p>
                        We received a request to reset your
                        Student HelpDesk password.
                    </p>

                    <p>
                        Click the button below to create a new password:
                    </p>

                    <p>
                        <a
                            href="{reset_link}"
                            style="
                                display: inline-block;
                                padding: 12px 22px;
                                background: #C9A66B;
                                color: #2B211B;
                                text-decoration: none;
                                border-radius: 8px;
                                font-weight: bold;
                            "
                        >
                            Reset Password
                        </a>
                    </p>

                    <p>
                        This link will expire automatically and can
                        only be used while the reset token is valid.
                    </p>

                    <p>
                        If you did not request a password reset,
                        you can safely ignore this email.
                    </p>

                    <p>
                        — Student HelpDesk Team
                    </p>

                </div>
            """
        }

        data = json.dumps(email_data).encode('utf-8')

        request_to_brevo = urllib.request.Request(
            'https://api.brevo.com/v3/smtp/email',
            data=data,
            headers={
                'accept': 'application/json',
                'api-key': settings.BREVO_API_KEY,
                'content-type': 'application/json'
            },
            method='POST'
        )

        try:
            with urllib.request.urlopen(
                request_to_brevo,
                timeout=15
            ) as response:

                if response.status not in [200, 201, 202]:
                    return Response(
                        {
                            'detail':
                                'Unable to send password reset email.'
                        },
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR
                    )

        except urllib.error.HTTPError as e:
            error_body = e.read().decode(
                'utf-8',
                errors='ignore'
            )

            print(
                'Brevo API error:',
                e.code,
                error_body
            )

            return Response(
                {
                    'detail':
                        'Unable to send password reset email.'
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        except Exception as e:
            print(
                'Brevo email error:',
                str(e)
            )

            return Response(
                {
                    'detail':
                        'Unable to send password reset email.'
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        return Response(
            {
                'message': (
                    'If an account exists with this email, '
                    'a password reset link has been sent.'
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
  