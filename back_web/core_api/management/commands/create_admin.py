from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from core_api.models import SecuritySettings
import getpass

User = get_user_model()

class Command(BaseCommand):
    help = 'Create an initial admin user and security settings'

    def handle(self, *args, **options):
        # Create initial admin user
        email = input('Enter admin email: ')
        username = input('Enter admin username: ')
        password = getpass.getpass('Enter admin password: ')
        
        try:
            # Check if user already exists
            if User.objects.filter(email=email).exists():
                self.stdout.write(
                    self.style.WARNING('Admin user with this email already exists.')
                )
                return

            # Create admin user
            admin_user = User.objects.create_user(
                email=email,
                username=username,
                password=password,
                is_staff=True,
                is_superuser=True,
                is_super_admin=True
            )
            
            self.stdout.write(
                self.style.SUCCESS(f'Successfully created admin user: {email}')
            )
            
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating admin user: {str(e)}')
            )
            return

        # Create security settings
        try:
            security_settings, created = SecuritySettings.objects.get_or_create(
                pk=1,
                defaults={
                    'session_timeout_minutes': 30,
                    'password_min_length': 8,
                    'max_login_attempts': 5,
                    'lockout_duration_minutes': 30,
                    'require_two_factor': False,
                    'email_notifications': True,
                    'security_alerts': True,
                    'ip_whitelist': '',
                    'updated_by': admin_user
                }
            )
            
            if created:
                self.stdout.write(
                    self.style.SUCCESS('Successfully created security settings')
                )
            else:
                self.stdout.write(
                    self.style.WARNING('Security settings already exist')
                )
                
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating security settings: {str(e)}')
            )

        self.stdout.write(
            self.style.SUCCESS('Admin setup completed successfully!')
        )
