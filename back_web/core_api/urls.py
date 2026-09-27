from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from .views import (
    DeveloperViewSet,
    InterviewProcessViewSet,
    JobViewSet,
    ProjectViewSet,
    ResourceViewSet,
    DemoBookingCreateView,
    ClientViewSet,
    PerformanceReviewViewSet, 
    JobApplicationViewSet,
    send_otp,
    verify_otp,
    register_customer,
    customer_login,
    CustomerViewSet,
    JobViewSet,
    DocumentationViewSet,
    SiteSettingsViewSet,
    InterviewProcessViewSet,
    reset_customer_password,
    FooterViewSet,
    NavbarLinkViewSet,
    HeroSectionViewSet,
    ContactViewSet,
    ContactMessageViewSet,
    AdminLoginView,
    admin_logout,
    admin_change_password,
    admin_forgot_password,
    admin_reset_password,
    security_dashboard,
    security_settings,
    google_auth,
    github_auth
)

router = DefaultRouter()
router.register(r'developers', DeveloperViewSet)
router.register(r'projects', ProjectViewSet)
router.register(r'resources', ResourceViewSet)
router.register(r'BookDemo', DemoBookingCreateView)
router.register(r'clients', ClientViewSet, basename='clients')
router.register(r'performance-reviews',PerformanceReviewViewSet,basename='performance-review')
router.register(r'jobs', JobViewSet)
router.register(r'job-applications', JobApplicationViewSet)
router.register("customers", CustomerViewSet)
router.register("documentation", DocumentationViewSet, basename="documentation")
router.register("site-settings", SiteSettingsViewSet, basename="site-settings")
router.register(r'interview-process', InterviewProcessViewSet)
router.register(r'footer', FooterViewSet, basename='footer')
router.register(r'navbar-links', NavbarLinkViewSet, basename='navbar-links')
router.register(r'hero-sections', HeroSectionViewSet, basename='hero-sections')
router.register(r'contact', ContactViewSet, basename='contact')
router.register(r'contact-messages', ContactMessageViewSet, basename='contact-messages')

urlpatterns = [
    path('', include(router.urls)),
    path('send-otp/', send_otp, name='send_otp'),
    path('verify-otp/', verify_otp, name='verify_otp'),
    path("customer/register/", register_customer),
    path("customer/login/", customer_login),
    path("reset-customer-password/", reset_customer_password),
    
    # Social Authentication URLs
    path('auth/google/', google_auth, name='google_auth'),
    path('auth/github/', github_auth, name='github_auth'),
    
    # Admin Authentication URLs
    path('auth/admin/login/', AdminLoginView.as_view(), name='admin_login'),
    path('auth/admin/logout/', admin_logout, name='admin_logout'),
    path('auth/admin/change-password/', admin_change_password, name='admin_change_password'),
    path('auth/admin/forgot-password/', admin_forgot_password, name='admin_forgot_password'),
    path('auth/admin/reset-password/', admin_reset_password, name='admin_reset_password'),
    path('auth/admin/security-dashboard/', security_dashboard, name='security_dashboard'),
    path('auth/admin/security-settings/', security_settings, name='security_settings'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
