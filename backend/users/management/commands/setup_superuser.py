from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.db import transaction
import logging

# Configure logging
logger = logging.getLogger(__name__)

User = get_user_model()


class Command(BaseCommand):
    help = 'Creates a superuser if it does not already exist'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Starting superuser setup...'))
        logger.info('Starting superuser setup process')

        email = 'admin@azughai.com'
        password = 'AzughAI2025'
        first_name = 'Admin'
        last_name = 'Admin'

        try:
            with transaction.atomic():
                if User.objects.filter(email=email).exists():
                    message = f"Superuser with email '{email}' already exists"
                    self.stdout.write(self.style.WARNING(message))
                    logger.info(message)
                else:
                    user = User.objects.create_superuser(
                        email=email,
                        password=password,
                        first_name=first_name,
                        last_name=last_name
                    )
                    message = f"Superuser '{email}' created successfully with ID {user.id}"
                    self.stdout.write(self.style.SUCCESS(message))
                    logger.info(message)
        except Exception as e:
            error_msg = f"Error creating superuser: {str(e)}"
            self.stdout.write(self.style.ERROR(error_msg))
            logger.error(error_msg)
            raise

        self.stdout.write(self.style.SUCCESS('Superuser setup completed'))
        logger.info('Superuser setup completed')
