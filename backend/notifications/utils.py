from .models import Notification, NotificationPreference


def notifications_enabled(recipient, notification_type):
    if not recipient:
        return False

    preferences, _ = NotificationPreference.objects.get_or_create(
        user=recipient
    )

    preference_map = {
        'COMPLAINT': preferences.complaint_updates,
        'OUTPASS': preferences.outpass_updates,
        'VERIFICATION': preferences.outpass_updates,
        'BROADCAST': preferences.safety_announcements,
    }

    return preference_map.get(notification_type, True)


def create_notification(
    recipient,
    title,
    message,
    notification_type='INFO',
    reference_id=None,
    reference_url=''
):
    if not recipient:
        return None

    if not notifications_enabled(
        recipient,
        notification_type
    ):
        return None

    return Notification.objects.create(
        recipient=recipient,
        title=title,
        message=message,
        notification_type=notification_type,
        reference_id=reference_id,
        reference_url=reference_url
    )
