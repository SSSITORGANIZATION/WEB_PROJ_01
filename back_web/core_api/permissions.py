from rest_framework import permissions, authentication
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth.models import AnonymousUser

class IsAuthenticatedOrReadOnly(permissions.BasePermission):
    """
    Allows read-only access for unauthenticated users,
    but requires authentication for write operations.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_authenticated

class IsAuthenticated(permissions.BasePermission):
    """
    Allows access only to authenticated users.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Allows read-only access for unauthenticated users,
    but allows write access only to the owner of the object.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Check if the object has a user field and if it matches the current user
        if hasattr(obj, 'user') and obj.user == request.user:
            return True
        
        # Check if the object has a created_by field and if it matches the current user
        if hasattr(obj, 'created_by') and obj.created_by == request.user:
            return True
            
        return False


class AdminTokenAuthentication(authentication.BaseAuthentication):
    """
    Custom authentication class for admin tokens.
    Accepts simple admin tokens for development purposes.
    """
    
    def authenticate(self, request):
        # Get the Authorization header
        auth_header = request.META.get('HTTP_AUTHORIZATION')
        
        if not auth_header:
            return None
            
        # Check if it's a Bearer token
        if not auth_header.startswith('Bearer '):
            return None
            
        token = auth_header.split(' ')[1]
        
        # Check if it's a valid admin token (simplified for development)
        if token.startswith('admin-token-'):
            # Create a mock admin user
            class MockAdminUser:
                def __init__(self):
                    self.id = 1
                    self.username = 'admin'
                    self.email = 'admin@example.com'
                    self.is_superuser = True
                    self.is_staff = True
                    self.is_authenticated = True
                    
                def has_perm(self, perm, obj=None):
                    return True
                    
                def has_module_perms(self, app_label):
                    return True
            
            user = MockAdminUser()
            return (user, token)
            
        return None


class IsAdminUser(permissions.BasePermission):
    """
    Allows access only to admin users.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated)
