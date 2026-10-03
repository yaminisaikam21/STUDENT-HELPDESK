"""
Django settings for Student HelpDesk project.
"""

from pathlib import Path
import os
import dj_database_url

from dotenv import load_dotenv


BASE_DIR = Path(__file__).resolve().parent.parent

load_dotenv(BASE_DIR / '.env')


SECRET_KEY = os.environ.get(
    'DJANGO_SECRET_KEY',
    'django-insecure-shd-campus-helpdesk-key-2026-teal-gold'
)

DEBUG = False

ALLOWED_HOSTS = [
    'student-helpdesk-lg6s.onrender.com',
    'localhost',
    '127.0.0.1',
]


# ---------------------------------------------------------
# Applications
# ---------------------------------------------------------

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Third-party apps
    'rest_framework',
    'rest_framework.authtoken',
    'corsheaders',

    # Local apps
    'accounts.apps.AccountsConfig',
    'complaints.apps.ComplaintsConfig',
    'outpass.apps.OutpassConfig',
    'notifications.apps.NotificationsConfig',
    'dashboard.apps.DashboardConfig',
]


# ---------------------------------------------------------
# Middleware
# ---------------------------------------------------------

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]


ROOT_URLCONF = 'config.urls'


# ---------------------------------------------------------
# Templates
# ---------------------------------------------------------

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]


WSGI_APPLICATION = 'config.wsgi.application'

ASGI_APPLICATION = 'config.asgi.application'


# ---------------------------------------------------------
# Database
# ---------------------------------------------------------

DATABASES = {
    'default': dj_database_url.config(
        default=os.environ.get('DATABASE_URL')
    )
}

# ---------------------------------------------------------
# Custom User Model
# ---------------------------------------------------------

AUTH_USER_MODEL = 'accounts.User'


# ---------------------------------------------------------
# Password Validation
# ---------------------------------------------------------

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
        'OPTIONS': {
            'min_length': 6
        }
    },
]


# ---------------------------------------------------------
# Internationalization
# ---------------------------------------------------------

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# ---------------------------------------------------------
# Static and Media Files
# ---------------------------------------------------------

STATIC_URL = 'static/'

STATIC_ROOT = BASE_DIR / 'staticfiles'

MEDIA_URL = '/media/'

MEDIA_ROOT = BASE_DIR / 'media'


DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


# ---------------------------------------------------------
# Django REST Framework
# ---------------------------------------------------------

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],

    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],

    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',

    'PAGE_SIZE': 50,
}


# ---------------------------------------------------------
# CORS Configuration
# ---------------------------------------------------------

CORS_ALLOW_ALL_ORIGINS = False

CORS_ALLOW_CREDENTIALS = False

CORS_ALLOWED_ORIGINS = [
    'https://student-helpdesk-lime.vercel.app',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
]


# ---------------------------------------------------------
# Frontend URL
# Used for password reset links
# ---------------------------------------------------------

FRONTEND_URL = os.environ.get(
    'FRONTEND_URL',
    'http://localhost:5173'
)


# ---------------------------------------------------------
# Gmail SMTP Email Configuration
# ---------------------------------------------------------
# Resend Email Configuration

RESEND_API_KEY = os.environ.get('RESEND_API_KEY')

DEFAULT_FROM_EMAIL = os.environ.get(
    'DEFAULT_FROM_EMAIL',
    'onboarding@resend.dev'
)