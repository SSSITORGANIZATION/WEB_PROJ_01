#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'devhub_backend.settings')
django.setup()

from core_api.models import AdminUser, SecuritySettings
from django.contrib.auth import get_user_model

def create_admin():
    User = get_user_model()
    
    # Create admin user
    try:
        admin_user = User.objects.create_user(
            email='admin@example.com',
            username='admin',
            password='Admin@123456',
            is_staff=True,
            is_superuser=True,
            is_super_admin=True
        )
        print(f"Successfully created admin user: {admin_user.email}")
    except Exception as e:
        print(f"Error creating admin user: {e}")
        return False

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
            print("Successfully created security settings")
        else:
            print("Security settings already exist")
            
    except Exception as e:
        print(f"Error creating security settings: {e}")
        return False

    print("Admin setup completed successfully!")
    print("Login credentials:")
    print("Email: admin@example.com")
    print("Password: Admin@123456")
    return True

if __name__ == '__main__':
    create_admin()
