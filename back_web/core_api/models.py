from django.db import models
from django.db.models.signals import post_delete, pre_save
from django.dispatch import receiver
from django.core.exceptions import ValidationError
from django.contrib.auth.models import AbstractUser, UserManager
from django.conf import settings
from django.utils import timezone

# core_api/models.py
class AdminUser(AbstractUser):
    """Custom admin user model for secure authentication"""
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True)
    is_super_admin = models.BooleanField(default=False)
    last_login_ip = models.GenericIPAddressField(null=True, blank=True)
    failed_login_attempts = models.PositiveIntegerField(default=0)
    is_locked = models.BooleanField(default=False)
    locked_until = models.DateTimeField(null=True, blank=True)
    password_reset_token = models.CharField(max_length=100, blank=True)
    password_reset_expires = models.DateTimeField(null=True, blank=True)
    two_factor_enabled = models.BooleanField(default=False)
    two_factor_secret = models.CharField(max_length=32, blank=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    objects = UserManager()
    
    def __str__(self):
        return f"{self.username} ({self.email})"
    
    def is_account_locked(self):
        """Check if account is currently locked"""
        if self.is_locked and self.locked_until:
            return timezone.now() < self.locked_until
        return False
    
    def reset_failed_attempts(self):
        """Reset failed login attempts"""
        self.failed_login_attempts = 0
        self.is_locked = False
        self.locked_until = None
        self.save()
    
    def increment_failed_attempts(self):
        """Increment failed login attempts and lock if threshold reached"""
        self.failed_login_attempts += 1
        if self.failed_login_attempts >= 5:
            self.is_locked = True
            self.locked_until = timezone.now() + timezone.timedelta(minutes=30)
        self.save()


class SecurityLog(models.Model):
    """Log security events for auditing"""
    ACTION_CHOICES = [
        ('LOGIN', 'Login'),
        ('LOGOUT', 'Logout'),
        ('FAILED_LOGIN', 'Failed Login'),
        ('PASSWORD_CHANGE', 'Password Change'),
        ('PASSWORD_RESET', 'Password Reset'),
        ('ACCOUNT_LOCK', 'Account Lock'),
        ('SECURITY_SETTING_CHANGE', 'Security Setting Change'),
    ]
    
    user = models.ForeignKey(AdminUser, on_delete=models.SET_NULL, null=True, blank=True)
    action = models.CharField(max_length=50, choices=ACTION_CHOICES)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    details = models.JSONField(default=dict, blank=True)
    success = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['-timestamp']
        verbose_name = 'Security Log'
        verbose_name_plural = 'Security Logs'
    
    def __str__(self):
        return f"{self.action} - {self.user} at {self.timestamp}"


class SecuritySettings(models.Model):
    """Global security configuration"""
    session_timeout_minutes = models.PositiveIntegerField(default=30)
    password_min_length = models.PositiveIntegerField(default=8)
    max_login_attempts = models.PositiveIntegerField(default=5)
    lockout_duration_minutes = models.PositiveIntegerField(default=30)
    require_two_factor = models.BooleanField(default=False)
    email_notifications = models.BooleanField(default=True)
    security_alerts = models.BooleanField(default=True)
    ip_whitelist = models.TextField(blank=True, help_text="One IP per line")
    updated_at = models.DateTimeField(auto_now=True)
    updated_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    
    class Meta:
        verbose_name = 'Security Setting'
        verbose_name_plural = 'Security Settings'
    
    def __str__(self):
        return "Security Settings"
    
    @classmethod
    def get_settings(cls):
        settings, created = cls.objects.get_or_create(pk=1)
        return settings


# --- Developer Profile ---
class Developer(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=100)
    title = models.CharField(max_length=100)
    bio = models.TextField()
    profile_image = models.ImageField(upload_to="developers/", blank=True, null=True)
    skills = models.CharField(max_length=255)  # React, Django, SQL
    experience_years = models.PositiveIntegerField(default=0)
    github_link = models.URLField(blank=True)
    linkedin_link = models.URLField(blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name


# --- Project ---
class Project(models.Model):
    developers = models.ManyToManyField(
        Developer, through="ProjectDeveloper", related_name="assigned_projects"
    )

    title = models.CharField(max_length=200)
    description = models.TextField()
    technologies_used = models.CharField(max_length=255)
    project_image = models.ImageField(upload_to="projects/", blank=True, null=True)
    github_repo = models.URLField(blank=True)
    live_link = models.URLField(blank=True)
    is_featured = models.BooleanField(default=False)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


# --- Resource (like a Blog/Guide) ---
class Resource(models.Model):
    CATEGORY_CHOICES = [
        ("BLOG", "Blog"),
        ("GUIDE", "Guide"),
        ("TOOL", "Tool / Calculator"),
        ("GLOSSARY", "Glossary Item"),
    ]

    TOOL_CHOICES = [
        ("currency", "Currency Converter"),
        ("gst", "GST Calculator"),
        ("emi", "EMI Calculator"),
    ]

    title = models.CharField(max_length=200)

    category = models.CharField(max_length=10, choices=CATEGORY_CHOICES, default="BLOG")

    # ✅ Used ONLY when category == TOOL
    tool_type = models.CharField(
        max_length=20, choices=TOOL_CHOICES, null=True, blank=True
    )

    content = models.TextField(blank=True)

    author = models.ForeignKey(
        Developer, on_delete=models.SET_NULL, null=True, blank=True
    )

    thumbnail = models.ImageField(upload_to="resources/", null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    published_on = models.DateField(null=True, blank=True)

    def clean(self):
        if self.category == "TOOL" and not self.tool_type:
            raise ValidationError(
                {"tool_type": "tool_type is required when category is TOOL."}
            )

        if self.category != "TOOL" and self.tool_type:
            raise ValidationError(
                {"tool_type": "tool_type must be empty unless category is TOOL."}
            )

    def __str__(self):
        return f"{self.category}: {self.title}"


@receiver(post_delete, sender=Resource)
def delete_resource_image(sender, instance, **kwargs):
    """
    Delete image file when Resource is deleted
    """
    if instance.thumbnail:
        instance.thumbnail.delete(save=False)


@receiver(pre_save, sender=Resource)
def delete_old_thumbnail_on_change(sender, instance, **kwargs):
    """
    Delete old image file when thumbnail is replaced
    """
    if not instance.pk:
        return  # New object, nothing to delete

    try:
        old = Resource.objects.get(pk=instance.pk)
    except Resource.DoesNotExist:
        return

    if old.thumbnail and old.thumbnail != instance.thumbnail:
        old.thumbnail.delete(save=False)


class DemoBooking(models.Model):

    PROJECT_TYPE_CHOICES = [
        ("web", "Web Development"),
        ("mobile", "Mobile App"),
        ("design", "UI/UX Design"),
        ("consulting", "Consulting"),
        ("other", "Other"),
    ]
    status = models.CharField(
        max_length=20,
        choices=[
            ("pending", "Pending"),
            ("scheduled", "Scheduled"),
            ("completed", "Completed"),
            ("cancelled", "Cancelled"),
        ],
        default="pending"
    )

    scheduled_date = models.DateField(null=True, blank=True)
    scheduled_time = models.TimeField(null=True, blank=True)
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=15)
    preferred_date = models.DateField()
    project_type = models.CharField(
        max_length=20,
        choices=PROJECT_TYPE_CHOICES,
        default="web"
    )
    message = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.project_type}"


class ProjectAsset(models.Model):
    ASSET_TYPE_CHOICES = [
        ("IMAGE", "Image"),
        ("DOCUMENT", "Document"),
        ("VIDEO", "Video"),
        ("OTHER", "Other"),
    ]

    project = models.ForeignKey(
        Project, on_delete=models.CASCADE, related_name="assets"
    )
    asset_name = models.CharField(max_length=150)
    asset_type = models.CharField(max_length=20, choices=ASSET_TYPE_CHOICES)
    file = models.FileField(upload_to="project_assets/")
    uploaded_by = models.ForeignKey("Developer", on_delete=models.SET_NULL, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.asset_name


class ProjectDocument(models.Model):
    DOCUMENT_TYPE_CHOICES = [
        ("REQ", "Requirement"),
        ("DESIGN", "Design"),
        ("REPORT", "Report"),
        ("OTHER", "Other"),
    ]

    project = models.ForeignKey(
        Project, on_delete=models.CASCADE, related_name="documents"
    )
    title = models.CharField(max_length=200)
    document_type = models.CharField(max_length=20, choices=DOCUMENT_TYPE_CHOICES)
    file = models.FileField(upload_to="project_documents/")
    version = models.CharField(max_length=20, default="1.0")
    uploaded_by = models.ForeignKey("Developer", on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Timesheet(models.Model):
    developer = models.ForeignKey("Developer", on_delete=models.CASCADE)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    date = models.DateField()
    hours_worked = models.DecimalField(max_digits=5, decimal_places=2)
    task_description = models.TextField()
    is_approved = models.BooleanField(default=False)
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.developer} - {self.project} ({self.date})"

class PerformanceReview(models.Model):
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name="reviews",
        null=True,
        blank=True
    )

    reviewer_name = models.CharField(max_length=100)
    rating = models.IntegerField()
    feedback = models.TextField()
    review_period = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.project.title if self.project else 'General Review'} - {self.rating}"

class Client(models.Model):
    client_name = models.CharField(max_length=100)
    company_name = models.CharField(max_length=150)
    company_address = models.TextField()
    company_description = models.TextField()
    project_description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.company_name


class EmailOTP(models.Model):
    email = models.EmailField()
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)

    def is_valid(self):
        return timezone.now() - self.created_at < timezone.timedelta(minutes=5)


class Customer(models.Model):
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15, blank=True)
    name = models.CharField(max_length=100)
    password = models.CharField(max_length=128, blank=True, null=True)  # hashed later, nullable for social auth
    auth_token = models.CharField(max_length=255, blank=True, null=True)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    # Social authentication fields
    google_id = models.CharField(max_length=255, blank=True, null=True, unique=True)
    github_id = models.CharField(max_length=255, blank=True, null=True, unique=True)
    avatar_url = models.URLField(blank=True, null=True)
    auth_provider = models.CharField(
        max_length=20,
        choices=[
            ('email', 'Email'),
            ('google', 'Google'),
            ('github', 'GitHub'),
        ],
        default='email'
    )

    def __str__(self):
        return self.email


class Asset(models.Model):
    STATUS_CHOICES = [
        ("Available", "Available"),
        ("In Use", "In Use"),
        ("Maintenance", "Maintenance"),
    ]

    name = models.CharField(max_length=100)
    asset_type = models.CharField(max_length=100)
    assigned_to = models.CharField(max_length=100, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    purchase_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.name


class Document(models.Model):
    title = models.CharField(max_length=150)
    category = models.CharField(max_length=100)
    uploaded_by = models.CharField(max_length=100)
    file = models.FileField(upload_to="documents/")
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


# models.py


class Job(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    experience_required = models.CharField(max_length=100)
    skills_required = models.TextField()
    location = models.CharField(max_length=100, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.title

    def is_expired(self):
        if not self.expires_at:
            return False
        return timezone.now().date() > self.expires_at


# models.py
class JobApplication(models.Model):
    STATUS_CHOICES = [
        ("submitted", "Submitted"),
        ("viewed", "Viewed"),
        ("selected", "Selected"),
        ("rejected", "Rejected"),
    ]

    job = models.ForeignKey(Job, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    position = models.CharField(max_length=100)
    education = models.CharField(max_length=200)
    skill_set = models.TextField()
    certification = models.CharField(max_length=200, blank=True)
    email = models.EmailField()
    contact = models.CharField(max_length=20)
    linkedin_id = models.URLField(blank=True)
    resume = models.FileField(upload_to="resumes/")
    experience = models.CharField(max_length=50)

    # 🔥 NEW FIELDS
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default="submitted"
    )
    viewed_at = models.DateTimeField(null=True, blank=True)
    decided_at = models.DateTimeField(null=True, blank=True)

    applied_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.first_name} - {self.job.title}"


class ProjectDeveloper(models.Model):

    ROLE_CHOICES = [
        ("FE", "Frontend"),
        ("BE", "Backend"),
        ("FS", "Fullstack"),
        ("UI", "UI/UX"),
        ("QA", "QA"),
        ("PM", "Project Manager"),
    ]

    MEMBER_TYPE = [
        ("LEAD", "Team Lead"),
        ("MEMBER", "Team Member"),
    ]

    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    developer = models.ForeignKey(Developer, on_delete=models.CASCADE)

    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    member_type = models.CharField(
        max_length=10,
        choices=MEMBER_TYPE,
            default="MEMBER"
    )

    assigned_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("project", "developer")

class Documentation(models.Model):

    id = models.BigAutoField(primary_key=True)

    project = models.ForeignKey(Project, on_delete=models.CASCADE)

    file = models.FileField(upload_to="documentations/")

    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)

    uploaded_by = models.CharField(max_length=100,default="Admin")

    category = models.CharField(max_length=100, blank=True)

# models.py

class SiteSettings(models.Model):
    logo = models.ImageField(upload_to="site/", blank=True, null=True)
    heading = models.CharField(max_length=200)
    subheading = models.TextField()

    def __str__(self):
        return "Site Settings"

class ProjectImage(models.Model):
    project = models.ForeignKey(
        Project, on_delete=models.CASCADE, related_name="project_images"
    )
    image = models.ImageField(upload_to="project_images/")
    alt_text = models.CharField(max_length=200, blank=True)
    is_featured = models.BooleanField(default=False)  # Primary image for the project
    created_at = models.DateTimeField(auto_now_add=True)
    order = models.PositiveIntegerField(default=0)  # For ordering images

    class Meta:
        ordering = ['order', 'created_at']

    def __str__(self):
        return f"{self.project.title} - Image {self.id}"


class Footer(models.Model):
    """Footer contact and company information"""
    email = models.EmailField(max_length=254, help_text="Contact email address")
    phone = models.CharField(max_length=20, blank=True, help_text="Contact phone number")
    address = models.TextField(blank=True, help_text="Company address")
    company_description = models.TextField(blank=True, help_text="Company description for footer")
    social_links = models.JSONField(default=dict, blank=True, help_text="Social media links as JSON")
    copyright_text = models.CharField(max_length=200, blank=True, help_text="Copyright text")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Footer Settings - {self.email}"

    class Meta:
        verbose_name = "Footer Setting"
        verbose_name_plural = "Footer Settings"


@receiver(post_delete, sender=ProjectImage)
def delete_project_image_file(sender, instance, **kwargs):
    """
    Delete image file when ProjectImage is deleted
    """
    if instance.image:
        instance.image.delete(save=False)


class InterviewProcess(models.Model):
    job = models.ForeignKey(
        "Job",
        on_delete=models.CASCADE,
        related_name="interview_rounds"
    )

    round_number = models.PositiveIntegerField()
    title = models.CharField(max_length=200)
    description = models.TextField()

    class Meta:
        ordering = ["round_number"]


class NavbarLink(models.Model):
    """Dynamic navigation links for the public website"""
    title = models.CharField(max_length=100, help_text="Display text for the navigation link")
    url = models.CharField(max_length=200, help_text="URL path (e.g., /projects or https://example.com)")
    order = models.PositiveIntegerField(default=0, help_text="Display order in navigation")
    is_active = models.BooleanField(default=True, help_text="Whether this link is visible")
    open_in_new_tab = models.BooleanField(default=False, help_text="Open link in new tab")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', 'title']
        verbose_name = "Navbar Link"
        verbose_name_plural = "Navbar Links"

    def __str__(self):
        return f"{self.title} - {self.url}"


class HeroSection(models.Model):
    """Dynamic hero section content for the homepage"""
    title = models.CharField(max_length=200, help_text="Main hero title")
    subtitle = models.TextField(help_text="Hero subtitle/description")
    badge_text = models.CharField(max_length=100, blank=True, help_text="Small badge text above title")
    primary_button_text = models.CharField(max_length=50, default="Explore Projects", help_text="Primary CTA button text")
    primary_button_url = models.CharField(max_length=200, default="/projects", help_text="Primary button URL")
    secondary_button_text = models.CharField(max_length=50, default="Join Community", help_text="Secondary CTA button text")
    secondary_button_url = models.CharField(max_length=200, default="/hiring", help_text="Secondary button URL")
    
    # Stats display
    stat1_label = models.CharField(max_length=50, default="Projects", help_text="First stat label")
    stat1_value = models.CharField(max_length=50, default="250+", help_text="First stat value")
    stat2_label = models.CharField(max_length=50, default="Developers", help_text="Second stat label")
    stat2_value = models.CharField(max_length=50, default="1.2k", help_text="Second stat value")
    stat3_label = models.CharField(max_length=50, default="Resources", help_text="Third stat label")
    stat3_value = models.CharField(max_length=50, default="45k", help_text="Third stat value")
    
    is_active = models.BooleanField(default=True, help_text="Whether this hero section is active")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Hero Section"
        verbose_name_plural = "Hero Sections"

    def __str__(self):
        return f"Hero: {self.title}"


class Contact(models.Model):
    """Dynamic contact information for the website"""
    # Main contact details
    company_name = models.CharField(max_length=200, default="The Critic")
    email = models.EmailField(help_text="Main contact email")
    phone = models.CharField(max_length=20, blank=True, help_text="Contact phone number")
    
    # Address information
    address_line1 = models.CharField(max_length=200, blank=True, help_text="First line of address")
    address_line2 = models.CharField(max_length=200, blank=True, help_text="Second line of address")
    city = models.CharField(max_length=100, blank=True, help_text="City")
    postal_code = models.CharField(max_length=20, blank=True, help_text="Postal/ZIP code")
    country = models.CharField(max_length=100, default="United Kingdom")
    
    # Department emails
    editorial_email = models.EmailField(blank=True, help_text="Editorial department email")
    advertising_email = models.EmailField(blank=True, help_text="Advertising department email")
    support_email = models.EmailField(blank=True, help_text="Technical support email")
    general_email = models.EmailField(blank=True, help_text="General inquiries email")
    
    # Business hours
    business_hours = models.CharField(max_length=100, default="Mon - Fri, 9:00 AM - 6:00 PM GMT", help_text="Business hours")
    
    # Social media links
    twitter_link = models.URLField(blank=True, help_text="Twitter/X profile URL")
    linkedin_link = models.URLField(blank=True, help_text="LinkedIn company page URL")
    facebook_link = models.URLField(blank=True, help_text="Facebook page URL")
    
    # Additional information
    contact_form_message = models.TextField(blank=True, help_text="Message displayed above contact form")
    location_description = models.TextField(blank=True, help_text="Description of office location")
    
    is_active = models.BooleanField(default=True, help_text="Whether this contact info is active")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Contact Information"
        verbose_name_plural = "Contact Information"

    def __str__(self):
        return f"Contact Info - {self.company_name}"

    @classmethod
    def get_active_contact(cls):
        """Get the active contact information"""
        return cls.objects.filter(is_active=True).first()

    def get_full_address(self):
        """Return formatted full address"""
        address_parts = []
        if self.address_line1:
            address_parts.append(self.address_line1)
        if self.address_line2:
            address_parts.append(self.address_line2)
        if self.city:
            address_parts.append(self.city)
        if self.postal_code:
            address_parts.append(self.postal_code)
        if self.country:
            address_parts.append(self.country)
        
        return '<br />'.join(address_parts) if address_parts else ''


class ContactMessage(models.Model):
    """Store contact form submissions from users"""
    name = models.CharField(max_length=100, help_text="Name of the person submitting the form")
    email = models.EmailField(help_text="Email address of the submitter")
    subject = models.CharField(max_length=200, help_text="Subject of the message")
    message = models.TextField(help_text="The actual message content")
    
    # Metadata
    ip_address = models.GenericIPAddressField(null=True, blank=True, help_text="IP address of the submitter")
    user_agent = models.TextField(blank=True, help_text="Browser user agent")
    is_read = models.BooleanField(default=False, help_text="Whether the message has been read")
    is_archived = models.BooleanField(default=False, help_text="Whether the message is archived")
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Contact Message"
        verbose_name_plural = "Contact Messages"
        ordering = ['-created_at']

    def __str__(self):
        return f"Message from {self.name} - {self.subject}"

    def mark_as_read(self):
        """Mark the message as read"""
        self.is_read = True
        self.save()

    def archive(self):
        """Archive the message"""
        self.is_archived = True
        self.save()
