import os

from django.core.management.base import BaseCommand
from accounts.models import User


class Command(BaseCommand):
    help = 'Create the project admin account'

    def handle(self, *args, **options):
        username = os.environ.get('ADMIN_USERNAME')
        email = os.environ.get('ADMIN_EMAIL')
        password = os.environ.get('ADMIN_PASSWORD')

        if not username or not email or not password:
            self.stdout.write(
                self.style.ERROR(
                    'Admin environment variables are missing.'
                )
            )
            return

        user, created = User.objects.get_or_create(
            username=username
        )

        if created:
            user.email = email
            user.role = 'ADMIN'
            user.is_staff = True
            user.is_superuser = True
            user.is_active = True
            user.set_password(password)
            user.save()

            self.stdout.write(
                self.style.SUCCESS(
                    'Admin account created successfully.'
                )
            )
        else:
            self.stdout.write(
                self.style.WARNING(
                    'Admin account already exists.'
                )
            )
