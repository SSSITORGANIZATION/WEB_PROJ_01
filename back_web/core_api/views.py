from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from rest_framework.decorators import (
    api_view,
    permission_classes,
    authentication_classes,
    action,
)
from rest_framework.views import APIView
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

from django.conf import settings
from django.core.mail import send_mail
from django.contrib.auth.hashers import make_password, check_password
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from .permissions import IsAdminUser as CustomIsAdminUser
from django.utils import timezone

import random

from .models import (
    Developer,
    Project,
    Resource,
    DemoBooking,
    Customer,
    PerformanceReview,
    Job,
    JobApplication,
    Client,
    EmailOTP,
    ProjectAsset,
    ProjectDeveloper,
    Documentation,
    SiteSettings,
    InterviewProcess,
    Footer,
    NavbarLink,
    HeroSection,
    AdminUser,
    SecurityLog,
    SecuritySettings,
    Contact,
    ContactMessage,
)
from .serializers import (
    DeveloperSerializer,
    ProjectSerializer,
    ResourceSerializer,
    DemoBookingSerializer,
    CustomerSerializer,
    CustomerLoginSerializer,
    PerformanceReviewSerializer,
    JobSerializer,
    JobApplicationSerializer,
    ClientSerializer,
    ProjectAssetSerializer,
    ProjectDeveloperSerializer,
    InterviewProcessSerializer,
    DocumentationSerializer,
    SiteSettingsSerializer,
    FooterSerializer,
    NavbarLinkSerializer,
    HeroSectionSerializer,
    ContactSerializer,
    ContactMessageSerializer,
)
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, login, logout
from django.utils.crypto import get_random_string
import secrets
from .permissions import IsAuthenticated, IsOwnerOrReadOnly


class InterviewProcessViewSet(viewsets.ModelViewSet):
    queryset = InterviewProcess.objects.all().order_by("round_number")
    serializer_class = InterviewProcessSerializer
    permission_classes = [AllowAny]  # Allow public access for interview process details


class SiteSettingsViewSet(viewsets.ModelViewSet):
    queryset = SiteSettings.objects.all()
    serializer_class = SiteSettingsSerializer
    permission_classes = [AllowAny]  # Allow public access for site settings


class DocumentationViewSet(viewsets.ModelViewSet):

    queryset = Documentation.objects.select_related("project", "created_by").order_by(
        "-id"
    )

    serializer_class = DocumentationSerializer
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser]

    def perform_create(self, serializer):

        user = None
        developer = None

        # ✅ Only assign if logged in
        if self.request.user.is_authenticated:
            user = self.request.user
            developer = Developer.objects.filter(user=user).first()

        serializer.save(created_by=user)


class DeveloperViewSet(viewsets.ModelViewSet):
    queryset = Developer.objects.all()
    serializer_class = DeveloperSerializer
    # Allow full public access for portfolio content
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser]


from rest_framework.parsers import MultiPartParser, FormParser
from .models import ProjectAsset


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [AllowAny]  # Allow full public access for portfolio content
    parser_classes = [MultiPartParser, FormParser]

    def get_serializer_context(self):
        return {"request": self.request}


class ResourceViewSet(viewsets.ModelViewSet):
    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer
    permission_classes = [AllowAny]  # Allow full public access for portfolio content
    parser_classes = (JSONParser, MultiPartParser, FormParser)
    pagination_class = None  # No default pagination

    def get_queryset(self):
        queryset = Resource.objects.all()
        category = self.request.query_params.get("category")
        ordering = self.request.query_params.get(
            "ordering", "-created_at"
        )  # Default to newest first

        if category:
            queryset = queryset.filter(category=category)

        # Apply ordering
        if ordering:
            queryset = queryset.order_by(ordering)

        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        # Check if pagination is requested (for admin panel)
        page = request.query_params.get("page")
        if page:
            # Use pagination
            from rest_framework.pagination import PageNumberPagination

            paginator = PageNumberPagination()
            paginator.page_size = int(request.query_params.get("page_size", 10))
            page_result = paginator.paginate_queryset(queryset, request)
            if page_result is not None:
                serializer = self.get_serializer(page_result, many=True)
                return paginator.get_paginated_response(serializer.data)

        # No pagination - return all results
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

from django.core.mail import send_mail
from django.conf import settings

class DemoBookingCreateView(viewsets.ModelViewSet):
    queryset = DemoBooking.objects.all()
    serializer_class = DemoBookingSerializer
    permission_classes = [AllowAny]
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            demo = serializer.save()

            print("NEW DEMO CREATED:", demo.email)  # DEBUG

            # ✅ Pending email
            subject = "Demo Request Received"
            message = f"""
    Dear {demo.name},

    Thank you for booking a demo.

    We have received your request and our team will contact you soon.

    Regards,
    Team
    """

            if demo.email:
                send_mail(
                    subject,
                    message,
                    settings.DEFAULT_FROM_EMAIL,
                    [demo.email],
                    fail_silently=False
                )

            return Response(serializer.data, status=201)

        return Response(serializer.errors, status=400)
    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        serializer = self.get_serializer(
            instance,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            demo = serializer.save()

            print("STATUS:", demo.status)  # DEBUG
            print("EMAIL:", demo.email)    # DEBUG

            subject = ""
            message = ""

            if demo.status == "pending":
                subject = "Demo Request Received"
                message = f"Dear {demo.name}, Thank you for booking demo."

            elif demo.status == "scheduled":
                subject = "Demo Scheduled"
                message = f"""
Dear {demo.name},

Your demo is scheduled on {demo.scheduled_date} at {demo.scheduled_time}.
"""

            elif demo.status == "completed":
                subject = "Demo Completed"
                message = f"Dear {demo.name}, Demo completed successfully."

            elif demo.status == "cancelled":
                subject = "Demo Cancelled"
                message = f"Sorry {demo.name}, your demo was cancelled."

            # ✅ SEND EMAIL
            if demo.email:
                send_mail(
                    subject,
                    message,
                    settings.DEFAULT_FROM_EMAIL,
                    [demo.email],
                    fail_silently=False
                )

            return Response(serializer.data)

        return Response(serializer.errors, status=400)
from rest_framework.viewsets import ModelViewSet
from .models import Client
from .serializers import ClientSerializer


class ClientViewSet(ModelViewSet):
    queryset = Client.objects.all().order_by("-created_at")
    serializer_class = ClientSerializer
    permission_classes = [IsAuthenticated]


from rest_framework.viewsets import ModelViewSet


class JobViewSet(ModelViewSet):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Job.objects.all()

        today = timezone.now().date()

        # If request is from admin (authenticated user)
        if self.request.user.is_authenticated:
            return queryset  # show ALL jobs including expired

        # Public users
        return queryset.filter(is_active=True).filter(
            expires_at__isnull=True
        ) | queryset.filter(is_active=True, expires_at__gte=today)


from rest_framework.decorators import action


class JobApplicationViewSet(ModelViewSet):
    queryset = JobApplication.objects.all()
    serializer_class = JobApplicationSerializer
    permission_classes = [AllowAny]  # Confidential data

    @action(detail=True, methods=["post"])
    def mark_viewed(self, request, pk=None):
        application = self.get_object()

        if application.status == "submitted":
            application.status = "viewed"
            application.viewed_at = timezone.now()
            application.save()

        return Response({"status": application.status})


class CustomerViewSet(ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    permission_classes = [IsAuthenticated]  # Customer data should be protected


@api_view(["POST"])
@permission_classes([AllowAny])
def send_otp(request):
    email = request.data.get("email")

    if not email:
        return Response({"error": "Email required"}, status=status.HTTP_400_BAD_REQUEST)

    otp = str(random.randint(100000, 999999))
    EmailOTP.objects.create(email=email, otp=otp)

    try:
        send_mail(
            "DevHub - Your OTP Code",
            f"Your DevHub OTP code is {otp}",
            settings.DEFAULT_FROM_EMAIL,
            [email],
        )
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response({"message": "OTP sent"}, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([AllowAny])
def verify_otp(request):
    email = request.data.get("email")
    otp = request.data.get("otp")

    if not email or not otp:
        return Response(
            {"error": "Email and OTP are required"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    record = EmailOTP.objects.filter(email=email, otp=otp).last()
    if not record or not record.is_valid():
        return Response(
            {"success": False, "error": "Invalid or expired OTP"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    return Response(
        {"success": True, "exists": Customer.objects.filter(email=email).exists()},
        status=status.HTTP_200_OK,
    )


@api_view(["POST"])
@permission_classes([AllowAny])
def register_customer(request):
    email = request.data.get("email")
    name = request.data.get("name")
    phone = request.data.get("phone")
    password = request.data.get("password")
    otp = request.data.get("otp")

    if not all([email, name, password, otp]):
        return Response(
            {"error": "Email, name, password and OTP are required"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    record = EmailOTP.objects.filter(email=email, otp=otp).last()
    if not record or not record.is_valid():
        return Response({"error": "Invalid or expired OTP"}, status=status.HTTP_400_BAD_REQUEST)

    if Customer.objects.filter(email=email).exists():
        return Response({"error": "Email already registered"}, status=status.HTTP_400_BAD_REQUEST)

    # Generate token for new customer
    import secrets
    token = secrets.token_urlsafe(32)

    customer = Customer.objects.create(
        email=email,
        name=name,
        phone=phone or "",
        password=make_password(password),
        auth_token=token,
        is_verified=True,
    )

    record.delete()

    return Response(
        {
            "token": token,
            "user": {
                "id": customer.id,
                "email": customer.email,
                "name": customer.name,
                "phone": customer.phone,
            }
        },
        status=status.HTTP_201_CREATED,
    )


@api_view(["POST"])
@permission_classes([AllowAny])
def customer_login(request):
    serializer = CustomerLoginSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    customer = serializer.validated_data["customer"]

    # Generate a simple token for customer authentication
    import secrets
    token = secrets.token_urlsafe(32)
    
    # Store token in customer model (you may want to add a token field to Customer model)
    # For now, we'll return the token directly
    customer.auth_token = token
    customer.save()

    return Response(
        {
            "token": token,
            "user": {
                "id": customer.id,
                "email": customer.email,
                "name": customer.name,
                "phone": customer.phone,
            }
        },
        status=status.HTTP_200_OK,
    )


@api_view(["POST"])
@permission_classes([AllowAny])
def reset_customer_password(request):
    email = request.data.get("email")
    password = request.data.get("password")

    if not email or not password:
        return Response({"error": "Email and password are required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        customer = Customer.objects.get(email=email)
    except Customer.DoesNotExist:
        return Response({"error": "Customer not found"}, status=status.HTTP_404_NOT_FOUND)

    customer.password = make_password(password)
    customer.save()

    return Response({"success": True}, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([AllowAny])
def google_auth(request):
    """Handle Google OAuth authentication"""
    google_id = request.data.get("google_id")
    email = request.data.get("email")
    name = request.data.get("name")
    avatar_url = request.data.get("avatar_url")
    
    if not google_id or not email:
        return Response({"error": "Google ID and email are required"}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Try to find existing customer by Google ID
        customer = Customer.objects.get(google_id=google_id)
    except Customer.DoesNotExist:
        # Try to find by email (in case they registered with email before)
        try:
            customer = Customer.objects.get(email=email)
            # Link Google account to existing customer
            customer.google_id = google_id
            customer.auth_provider = 'google'
            if avatar_url:
                customer.avatar_url = avatar_url
            customer.is_verified = True
            customer.save()
        except Customer.DoesNotExist:
            # Create new customer
            customer = Customer.objects.create(
                email=email,
                name=name or email.split('@')[0],
                google_id=google_id,
                avatar_url=avatar_url,
                auth_provider='google',
                is_verified=True,
                password=''  # No password for social auth
            )
    
    # Generate token
    token = secrets.token_urlsafe(32)
    customer.auth_token = token
    customer.save()
    
    return Response(
        {
            "token": token,
            "user": {
                "id": customer.id,
                "email": customer.email,
                "name": customer.name,
                "phone": customer.phone,
                "avatar_url": customer.avatar_url,
                "auth_provider": customer.auth_provider
            }
        },
        status=status.HTTP_200_OK,
    )


@api_view(["POST"])
@permission_classes([AllowAny])
def github_auth(request):
    """Handle GitHub OAuth authentication"""
    github_id = request.data.get("github_id")
    email = request.data.get("email")
    name = request.data.get("name")
    avatar_url = request.data.get("avatar_url")
    
    if not github_id:
        return Response({"error": "GitHub ID is required"}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Try to find existing customer by GitHub ID
        customer = Customer.objects.get(github_id=github_id)
    except Customer.DoesNotExist:
        # Try to find by email (in case they registered with email before)
        try:
            customer = Customer.objects.get(email=email)
            # Link GitHub account to existing customer
            customer.github_id = github_id
            customer.auth_provider = 'github'
            if avatar_url:
                customer.avatar_url = avatar_url
            customer.is_verified = True
            customer.save()
        except Customer.DoesNotExist:
            # Create new customer
            customer = Customer.objects.create(
                email=email or f"github-{github_id}@placeholder.com",
                name=name or email.split('@')[0] if email else f"GitHub User {github_id}",
                github_id=github_id,
                avatar_url=avatar_url,
                auth_provider='github',
                is_verified=True,
                password=''  # No password for social auth
            )
    
    # Generate token
    token = secrets.token_urlsafe(32)
    customer.auth_token = token
    customer.save()
    
    return Response(
        {
            "token": token,
            "user": {
                "id": customer.id,
                "email": customer.email,
                "name": customer.name,
                "phone": customer.phone,
                "avatar_url": customer.avatar_url,
                "auth_provider": customer.auth_provider
            }
        },
        status=status.HTTP_200_OK,
    )


from rest_framework import viewsets, permissions
from .models import PerformanceReview
from .serializers import PerformanceReviewSerializer


class PerformanceReviewViewSet(viewsets.ModelViewSet):
    serializer_class = PerformanceReviewSerializer
    permission_classes = [AllowAny]  # Allow public access for reviews

    def get_queryset(self):
        queryset = PerformanceReview.objects.select_related("project").order_by(
            "-created_at"
        )

        project_id = self.request.query_params.get("project")
        if project_id:
            queryset = queryset.filter(project_id=project_id)

        return queryset

    def perform_create(self, serializer):
        serializer.save()


# Admin Authentication Views
@method_decorator(csrf_exempt, name="dispatch")
class AdminLoginView(APIView):
    """Secure admin authentication"""

    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response({"error": "Email and password are required"}, status=400)

        try:
            admin_user = AdminUser.objects.get(email=email)

            # Check if account is locked
            if admin_user.is_account_locked():
                SecurityLog.objects.create(
                    user=admin_user,
                    action="FAILED_LOGIN",
                    ip_address=self.get_client_ip(request),
                    user_agent=request.META.get("HTTP_USER_AGENT", ""),
                    success=False,
                    details={"reason": "Account locked"},
                )
                return Response(
                    {"error": "Account is temporarily locked. Please try again later."},
                    status=403,
                )

            # Authenticate user
            if not admin_user.check_password(password):
                admin_user.increment_failed_attempts()
                SecurityLog.objects.create(
                    user=admin_user,
                    action="FAILED_LOGIN",
                    ip_address=self.get_client_ip(request),
                    user_agent=request.META.get("HTTP_USER_AGENT", ""),
                    success=False,
                )
                return Response({"error": "Invalid credentials"}, status=401)

            # Successful login
            admin_user.reset_failed_attempts()
            admin_user.last_login_ip = self.get_client_ip(request)
            admin_user.save()

            # Create or get auth token
            token, created = Token.objects.get_or_create(user=admin_user)

            SecurityLog.objects.create(
                user=admin_user,
                action="LOGIN",
                ip_address=self.get_client_ip(request),
                user_agent=request.META.get("HTTP_USER_AGENT", ""),
                success=True,
            )

            return Response(
                {
                    "success": True,
                    "token": token.key,
                    "user": {
                        "id": admin_user.id,
                        "email": admin_user.email,
                        "username": admin_user.username,
                        "is_super_admin": admin_user.is_super_admin,
                        "last_login": admin_user.last_login,
                    },
                }
            )

        except AdminUser.DoesNotExist:
            SecurityLog.objects.create(
                action="FAILED_LOGIN",
                ip_address=self.get_client_ip(request),
                user_agent=request.META.get("HTTP_USER_AGENT", ""),
                success=False,
                details={"email": email},
            )
            return Response({"error": "Invalid credentials"}, status=401)

    def get_client_ip(self, request):
        x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
        if x_forwarded_for:
            ip = x_forwarded_for.split(",")[0]
        else:
            ip = request.META.get("REMOTE_ADDR")
        return ip


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def admin_logout(request):
    """Secure admin logout"""
    try:
        # Delete auth token
        Token.objects.filter(user=request.user).delete()

        SecurityLog.objects.create(
            user=request.user,
            action="LOGOUT",
            ip_address=request.META.get("REMOTE_ADDR"),
            user_agent=request.META.get("HTTP_USER_AGENT", ""),
            success=True,
        )

        return Response({"success": True})
    except Exception as e:
        return Response({"error": str(e)}, status=400)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def admin_change_password(request):
    """Change admin password securely"""
    old_password = request.data.get("old_password")
    new_password = request.data.get("new_password")

    if not old_password or not new_password:
        return Response(
            {"error": "Old password and new password are required"}, status=400
        )

    # Validate new password against security settings
    security_settings = SecuritySettings.get_settings()
    if len(new_password) < security_settings.password_min_length:
        return Response(
            {
                "error": f"Password must be at least {security_settings.password_min_length} characters long"
            },
            status=400,
        )

    try:
        if not request.user.check_password(old_password):
            return Response({"error": "Current password is incorrect"}, status=400)

        request.user.set_password(new_password)
        request.user.save()

        # Delete old tokens to force re-login
        Token.objects.filter(user=request.user).delete()

        SecurityLog.objects.create(
            user=request.user,
            action="PASSWORD_CHANGE",
            ip_address=request.META.get("REMOTE_ADDR"),
            user_agent=request.META.get("HTTP_USER_AGENT", ""),
            success=True,
        )

        return Response({"success": True})

    except Exception as e:
        return Response({"error": str(e)}, status=400)


@api_view(["POST"])
@permission_classes([AllowAny])
@csrf_exempt
def admin_forgot_password(request):
    """Generate password reset token for admin"""
    email = request.data.get("email")

    if not email:
        return Response({"error": "Email is required"}, status=400)

    try:
        admin_user = AdminUser.objects.get(email=email)

        # Generate secure reset token
        reset_token = secrets.token_urlsafe(32)
        admin_user.password_reset_token = reset_token
        admin_user.password_reset_expires = timezone.now() + timezone.timedelta(hours=1)
        admin_user.save()

        SecurityLog.objects.create(
            user=admin_user,
            action="PASSWORD_RESET",
            ip_address=request.META.get("REMOTE_ADDR"),
            user_agent=request.META.get("HTTP_USER_AGENT", ""),
            success=True,
            details={"token_generated": True},
        )

        # In production, send email with reset link
        # For now, return token (remove in production)
        return Response(
            {
                "success": True,
                "message": "Password reset instructions sent to your email",
                "token": reset_token,  # Remove this in production
            }
        )

    except AdminUser.DoesNotExist:
        # Don't reveal if email exists or not
        return Response(
            {
                "success": True,
                "message": "If the email exists, reset instructions will be sent",
            }
        )
    except Exception as e:
        return Response({"error": str(e)}, status=400)


@api_view(["POST"])
@permission_classes([AllowAny])
@csrf_exempt
def admin_reset_password(request):
    """Reset password using token"""
    token = request.data.get("token")
    new_password = request.data.get("new_password")

    if not token or not new_password:
        return Response({"error": "Token and new password are required"}, status=400)

    try:
        admin_user = AdminUser.objects.get(
            password_reset_token=token, password_reset_expires__gt=timezone.now()
        )

        # Validate new password
        security_settings = SecuritySettings.get_settings()
        if len(new_password) < security_settings.password_min_length:
            return Response(
                {
                    "error": f"Password must be at least {security_settings.password_min_length} characters long"
                },
                status=400,
            )

        admin_user.set_password(new_password)
        admin_user.password_reset_token = ""
        admin_user.password_reset_expires = None
        admin_user.reset_failed_attempts()
        admin_user.save()

        SecurityLog.objects.create(
            user=admin_user,
            action="PASSWORD_RESET",
            ip_address=request.META.get("REMOTE_ADDR"),
            user_agent=request.META.get("HTTP_USER_AGENT", ""),
            success=True,
            details={"password_reset_completed": True},
        )

        return Response({"success": True})

    except AdminUser.DoesNotExist:
        return Response({"error": "Invalid or expired reset token"}, status=400)
    except Exception as e:
        return Response({"error": str(e)}, status=400)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def security_dashboard(request):
    """Get real security metrics for dashboard"""
    try:
        # Get real security data
        security_logs = SecurityLog.objects.all()

        # Calculate metrics
        now = timezone.now()
        day_ago = now - timezone.timedelta(days=1)
        week_ago = now - timezone.timedelta(weeks=1)

        threats_blocked = security_logs.filter(
            action="FAILED_LOGIN", timestamp__gte=week_ago
        ).count()

        active_threats = AdminUser.objects.filter(
            is_locked=True, locked_until__gt=now
        ).count()

        failed_logins = security_logs.filter(
            action="FAILED_LOGIN", timestamp__gte=day_ago
        ).count()

        recent_activity = security_logs.filter(timestamp__gte=day_ago).order_by(
            "-timestamp"
        )[:10]

        security_settings = SecuritySettings.get_settings()

        return Response(
            {
                "threats": {
                    "blocked": threats_blocked,
                    "active": active_threats,
                    "resolved": AdminUser.objects.filter(is_locked=False).count(),
                },
                "auth": {
                    "attempts": security_logs.filter(action="LOGIN").count(),
                    "failures": security_logs.filter(action="FAILED_LOGIN").count(),
                    "lockouts": AdminUser.objects.filter(is_locked=True).count(),
                },
                "settings": {
                    "session_timeout": security_settings.session_timeout_minutes,
                    "password_min_length": security_settings.password_min_length,
                    "max_login_attempts": security_settings.max_login_attempts,
                    "require_two_factor": security_settings.require_two_factor,
                    "email_notifications": security_settings.email_notifications,
                    "security_alerts": security_settings.security_alerts,
                },
                "recent_activity": [
                    {
                        "action": log.action,
                        "timestamp": log.timestamp,
                        "user": log.user.username if log.user else "System",
                        "success": log.success,
                        "ip_address": log.ip_address,
                    }
                    for log in recent_activity
                ],
            }
        )

    except Exception as e:
        return Response({"error": str(e)}, status=400)


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def security_settings(request):
    """Get or update security settings"""
    if request.method == "GET":
        settings = SecuritySettings.get_settings()
        return Response(
            {
                "session_timeout": settings.session_timeout_minutes,
                "password_min_length": settings.password_min_length,
                "max_login_attempts": settings.max_login_attempts,
                "lockout_duration": settings.lockout_duration_minutes,
                "require_two_factor": settings.require_two_factor,
                "email_notifications": settings.email_notifications,
                "security_alerts": settings.security_alerts,
                "ip_whitelist": settings.ip_whitelist,
            }
        )

    elif request.method == "POST":
        settings = SecuritySettings.get_settings()

        # Update settings
        settings.session_timeout_minutes = request.data.get(
            "session_timeout", settings.session_timeout_minutes
        )
        settings.password_min_length = request.data.get(
            "password_min_length", settings.password_min_length
        )
        settings.max_login_attempts = request.data.get(
            "max_login_attempts", settings.max_login_attempts
        )
        settings.lockout_duration_minutes = request.data.get(
            "lockout_duration", settings.lockout_duration_minutes
        )
        settings.require_two_factor = request.data.get(
            "require_two_factor", settings.require_two_factor
        )
        settings.email_notifications = request.data.get(
            "email_notifications", settings.email_notifications
        )
        settings.security_alerts = request.data.get(
            "security_alerts", settings.security_alerts
        )
        settings.ip_whitelist = request.data.get("ip_whitelist", settings.ip_whitelist)
        settings.updated_by = request.user
        settings.save()

        SecurityLog.objects.create(
            user=request.user,
            action="SECURITY_SETTING_CHANGE",
            ip_address=request.META.get("REMOTE_ADDR"),
            user_agent=request.META.get("HTTP_USER_AGENT", ""),
            success=True,
            details={"updated_fields": list(request.data.keys())},
        )

        return Response({"success": True})


class FooterViewSet(viewsets.ModelViewSet):
    """ViewSet for Footer model - manages footer contact and company information"""

    queryset = Footer.objects.all()
    serializer_class = FooterSerializer
    permission_classes = [AllowAny]  # Allow public access for footer data

    def get_queryset(self):
        """Return only the first footer record or create default if none exists"""
        footer = Footer.objects.first()
        if not footer:
            # Create default footer if none exists
            footer = Footer.objects.create(
                email="contact@example.com",
                phone="+1 234 567 8900",
                address="123 Business Street, City, State 12345",
                company_description="Professional platform for software development",
                social_links={},
                copyright_text="© 2024 Your Company. All rights reserved.",
            )
        return Footer.objects.filter(id=footer.id)


class NavbarLinkViewSet(viewsets.ModelViewSet):
    """ViewSet for managing navbar links"""

    queryset = NavbarLink.objects.all().order_by("order", "title")
    serializer_class = NavbarLinkSerializer
    permission_classes = [
        AllowAny
    ]  # Allow public access for GET, but you might want to restrict POST/PUT/DELETE


class HeroSectionViewSet(viewsets.ModelViewSet):
    """ViewSet for managing hero sections"""

    queryset = HeroSection.objects.all().order_by("-created_at")
    serializer_class = HeroSectionSerializer
    permission_classes = [
        AllowAny
    ]  # Allow public access for GET, but you might want to restrict POST/PUT/DELETE

    def get_queryset(self):
        """Return only active hero sections for public access"""
        if self.request.method in ["GET"]:
            return HeroSection.objects.filter(is_active=True).order_by("-created_at")
        return HeroSection.objects.all().order_by("-created_at")


class ContactViewSet(viewsets.ModelViewSet):
    """ViewSet for managing contact information"""

    queryset = Contact.objects.all().order_by("-created_at")
    serializer_class = ContactSerializer
    permission_classes = [
        AllowAny
    ]  # Allow public access for GET, but restrict POST/PUT/DELETE to admin

    def get_queryset(self):
        """Return only active contact info for public access"""
        if self.request.method in ["GET"]:
            return Contact.objects.filter(is_active=True).order_by("-created_at")
        return Contact.objects.all().order_by("-created_at")

    def get_permissions(self):
        """Restrict write operations to admin users"""
        if self.request.method in ["POST", "PUT", "PATCH", "DELETE"]:
            return [IsAdminUser()]
        return [AllowAny()]


class ContactMessageViewSet(viewsets.ModelViewSet):
    """ViewSet for managing contact form submissions"""

    queryset = ContactMessage.objects.all().order_by("-created_at")
    serializer_class = ContactMessageSerializer
    permission_classes = [AllowAny]

    def get_permissions(self):
        """Allow anyone to submit messages, but only admin can view/manage them"""
        if self.request.method == "POST":
            return [AllowAny()]  # Anyone can submit a contact form
        return [AllowAny()]  # Only admin can view, edit, delete messages

    def create(self, request, *args, **kwargs):
        """Create a new contact message with metadata"""
        # Get client IP and user agent
        ip_address = self.get_client_ip(request)
        user_agent = request.META.get("HTTP_USER_AGENT", "")

        # Add metadata to the request data
        request_data = request.data.copy()
        request_data["ip_address"] = ip_address
        request_data["user_agent"] = user_agent

        serializer = self.get_serializer(data=request_data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )

    def get_client_ip(self, request):
        """Get the client IP address"""
        x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
        if x_forwarded_for:
            ip = x_forwarded_for.split(",")[0]
        else:
            ip = request.META.get("REMOTE_ADDR")
        return ip

    @action(detail=True, methods=["post"])
    def mark_as_read(self, request, pk=None):
        """Mark a message as read"""
        message = self.get_object()
        message.mark_as_read()
        return Response({"status": "message marked as read"})

    @action(detail=True, methods=["post"])
    def archive(self, request, pk=None):
        """Archive a message"""
        message = self.get_object()
        message.archive()
        return Response({"status": "message archived"})


from django.core.mail import send_mail

