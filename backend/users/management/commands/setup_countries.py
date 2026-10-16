from django.core.management.base import BaseCommand
from django_countries import countries
from users.models.models import Country


class Command(BaseCommand):
    help = 'Import countries from django-countries library into the database'

    def handle(self, *args, **kwargs):
        total_countries = 0
        skipped_countries = 0
        added_countries = 0

        self.stdout.write(self.style.NOTICE('Starting country import...'))
        
        for code, name in list(countries):
            # Check if country already exists by code
            if not Country.objects.filter(code=code).exists():
                # Create new country
                Country.objects.create(
                    name=name,
                    code=code
                )
                added_countries += 1
                self.stdout.write(
                    self.style.SUCCESS(f'Added country: {name} ({code})')
                )
            else:
                skipped_countries += 1
                self.stdout.write(
                    self.style.WARNING(f'Skipped existing country: {name} ({code})')
                )
            
            total_countries += 1
        
        self.stdout.write(
            self.style.SUCCESS(
                f'Country import completed: {total_countries} processed, '
                f'{added_countries} added, {skipped_countries} skipped.'
            )
        )
