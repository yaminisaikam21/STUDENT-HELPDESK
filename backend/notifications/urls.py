from django.urls import path

from .views import (
    NotificationListView,
    NotificationDetailView,
    MarkNotificationReadView,
    MarkAllNotificationsReadView,
    DeleteNotificationView,
    BroadcastNotificationView,
    NotificationPreferencesView,
)


urlpatterns = [
    path(
        '',
        NotificationListView.as_view(),
        name='notification_list'
    ),

    path(
        '<int:pk>/',
        NotificationDetailView.as_view(),
        name='notification_detail'
    ),

    path(
        '<int:pk>/read/',
        MarkNotificationReadView.as_view(),
        name='mark_notification_read'
    ),

    path(
        'read-all/',
        MarkAllNotificationsReadView.as_view(),
        name='mark_all_notifications_read'
    ),

    path(
        '<int:pk>/delete/',
        DeleteNotificationView.as_view(),
        name='delete_notification'
    ),

    path(
        'broadcast/',
        BroadcastNotificationView.as_view(),
        name='broadcast_notification'
    ),

    path(
        'preferences/',
        NotificationPreferencesView.as_view(),
        name='notification_preferences'
    ),
]