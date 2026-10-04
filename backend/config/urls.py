from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('admin/', admin.site.urls),

    path(
        'api/auth/',
        include('accounts.urls')
    ),

    path(
        'api/complaints/',
        include('complaints.urls')
    ),

    path(
        'api/outpasses/',
        include('outpass.urls')
    ),

    path(
        'api/notifications/',
        include('notifications.urls')
    ),

    path(
        'api/admin/',
        include('dashboard.urls')
    ),
]


# Serve uploaded media files
# This is required for complaint attachments/images.
urlpatterns += static(
    settings.MEDIA_URL,
    document_root=settings.MEDIA_ROOT
)


# Serve static files during development
if settings.DEBUG:
    urlpatterns += static(
        settings.STATIC_URL,
        document_root=settings.STATIC_ROOT
    )
    