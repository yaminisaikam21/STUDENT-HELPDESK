from django.db import models
from django.conf import settings


class NotificationPreference(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notification_preferences'
    )

    complaint_updates = models.BooleanField(default=True)
    outpass_updates = models.BooleanField(default=True)
    safety_announcements = models.BooleanField(default=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Notification preferences for {self.user.username}"


class Notification(models.Model):
    TYPE_CHOICES = [
        ('COMPLAINT', 'Complaint Update'),
        ('OUTPASS', 'Outpass Update'),
        ('VERIFICATION', 'Parent Verification'),
        ('BROADCAST', 'Campus Announcement'),
        ('SYSTEM', 'System Alert'),
    ]

    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notifications'
    )

    title = models.CharField(max_length=255)
    message = models.TextField()

    notification_type = models.CharField(
        max_length=50,
        choices=TYPE_CHOICES,
        default='SYSTEM'
    )

    is_read = models.BooleanField(default=False)

    reference_id = models.IntegerField(
        null=True,
        blank=True
    )

    reference_url = models.CharField(
        max_length=255,
        blank=True,
        default=''
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return (
            f"[{self.notification_type}] "
            f"to {self.recipient.username}: "
            f"{self.title}"
        )