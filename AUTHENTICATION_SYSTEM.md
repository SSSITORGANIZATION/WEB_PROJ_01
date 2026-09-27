# Authentication System Implementation

## Overview

A complete authentication system has been implemented with the following features:

- ✅ Email/password registration with OTP verification
- ✅ Email/password login
- ✅ Google OAuth integration
- ✅ GitHub OAuth integration
- ✅ Protected routes (login required for main pages)
- ✅ Backend user account management
- ✅ Token-based authentication
- ✅ Social auth account linking

## What Was Changed

### Backend (Django)

**Model Changes (`back_web/core_api/models.py`):**
- Added `google_id` field to Customer model
- Added `github_id` field to Customer model  
- Added `avatar_url` field to Customer model
- Added `auth_provider` field (email/google/github)
- Made `password` field nullable (for social auth users)

**New API Endpoints (`back_web/core_api/views.py`):**
- `POST /auth/google/` - Handle Google OAuth authentication
- `POST /auth/github/` - Handle GitHub OAuth authentication

**Serializer Updates (`back_web/core_api/serializers.py`):**
- Updated CustomerSerializer to include new social auth fields
- Updated CustomerLoginSerializer to handle social auth accounts

**URL Routes (`back_web/core_api/urls.py`):**
- Added routes for Google and GitHub authentication

### Frontend (React)

**Component Updates:**
- Updated `SocialLogin.jsx` to integrate with backend endpoints
- Added social login to `CustomerRegister.jsx`
- Updated avatar display in `App.jsx` to use `avatar_url`

**Routing Changes (`App.jsx`):**
- Added `ProtectedRoute` wrapper to all main pages
- Users now see login page first when visiting the site
- Auth pages (login/register) are public routes

**Configuration:**
- Created `.env.local` template for Firebase credentials
- Created `FIREBASE_SETUP.md` with detailed setup instructions

## How It Works

### New User Flow

1. User visits the website → Redirected to login page
2. User can choose:
   - **Email/Password**: Enter details → Receive OTP → Verify → Account created
   - **Google OAuth**: Click "Continue with Google" → Auth with Google → Account created automatically
   - **GitHub OAuth**: Click "Continue with GitHub" → Auth with GitHub → Account created automatically

### Returning User Flow

1. User visits the website → Redirected to login page
2. User can sign in with:
   - Email/password (if registered that way)
   - Google OAuth (if linked to Google)
   - GitHub OAuth (if linked to GitHub)

3. Backend validates credentials and returns token
4. Frontend stores token and user data
5. User redirected to home page with full access

### Social Auth Account Linking

If a user:
- First registered with email/password
- Later signs in with Google/GitHub

The system will:
- Link the social account to their existing email account
- Update their `auth_provider` field
- Preserve their existing data

## Setup Required

### 1. Firebase Configuration (Required for OAuth)

See `front_web/FIREBASE_SETUP.md` for detailed instructions.

**Quick Start:**
1. Create Firebase project at https://console.firebase.google.com/
2. Enable Google and GitHub sign-in methods
3. Get Firebase config credentials
4. Update `front_web/.env.local` with your credentials
5. Restart frontend server

### 2. Backend Migration (Already Done)

The database migration has been applied. No action needed.

### 3. Start Services

```bash
# Terminal 1: Start Django backend
cd back_web
python manage.py runserver

# Terminal 2: Start React frontend  
cd front_web
npm run dev
```

## API Endpoints

### Authentication
- `POST /send-otp/` - Send OTP to email
- `POST /verify-otp/` - Verify OTP code
- `POST /customer/register/` - Register with email/password
- `POST /customer/login/` - Login with email/password
- `POST /auth/google/` - Authenticate with Google
- `POST /auth/github/` - Authenticate with GitHub
- `POST /reset-customer-password/` - Reset password

## Protected Routes

The following routes require authentication (detailed content):
- `/project/:id` - Project details
- `/developer/:id` - Developer details
- `/resources/:id` - Resource details
- `/apply/:id` - Job application

Public routes (browse freely without login):
- `/` (Home)
- `/projects` - Projects list
- `/developers` - Developers list
- `/resources` - Resources list
- `/hiring` - Job listings
- `/documentation` - Documentation list
- `/book-demo/:projectTitle?` - Book demo
- `/review/:projectId` - Write review
- `/reviews` - Public reviews
- `/join-community` - Join community
- `/about` - About page
- `/contact` - Contact page
- `/auth/login` - Login page
- `/auth/register` - Register page
- `/auth/forgot-password` - Forgot password
- `/auth/reset-password` - Reset password
- `/admin-login` - Admin login

## Database Schema

### Customer Model

```python
class Customer(models.Model):
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15, blank=True)
    name = models.CharField(max_length=100)
    password = models.CharField(max_length=128, blank=True, null=True)  # Nullable for social auth
    auth_token = models.CharField(max_length=255, blank=True, null=True)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    # Social authentication fields
    google_id = models.CharField(max_length=255, blank=True, null=True, unique=True)
    github_id = models.CharField(max_length=255, blank=True, null=True, unique=True)
    avatar_url = models.URLField(blank=True, null=True)
    auth_provider = models.CharField(
        max_length=20,
        choices=[('email', 'Email'), ('google', 'Google'), ('github', 'GitHub')],
        default='email'
    )
```

## Security Features

- Passwords are hashed using Django's `make_password()`
- Tokens are generated using `secrets.token_urlsafe(32)` for secure random tokens
- Social auth users don't have passwords (prevents password-based attacks)
- Email verification via OTP
- Account linking prevents duplicate accounts

## Testing the System

1. **Without Firebase (Email/Password only):**
   - Visit `http://localhost:4002`
   - Click "Sign up" 
   - Fill in details and submit
   - Check email for OTP (using configured Gmail)
   - Verify OTP to complete registration
   - Login with credentials

2. **With Firebase (Social Auth):**
   - Complete Firebase setup first
   - Visit `http://localhost:4002`
   - Click "Continue with Google" or "Continue with GitHub"
   - Complete OAuth flow
   - Account created automatically
   - Redirected to home page

## Troubleshooting

**Users not redirected to login page:**
- Check that `ProtectedRoute` is applied to routes in `App.jsx`
- Clear browser localStorage to test fresh login flow

**Social auth buttons not working:**
- Verify Firebase credentials in `.env.local`
- Check browser console for Firebase errors
- Ensure sign-in methods are enabled in Firebase Console

**Backend auth errors:**
- Ensure Django server is running on port 8000
- Check that migrations are applied
- Verify CORS settings in Django settings

**OTP not received:**
- Check email configuration in `back_web/devhub_backend/settings.py`
- Verify Gmail app password is correct
- Check spam folder

## Files Modified

### Backend
- `back_web/core_api/models.py` - Added social auth fields
- `back_web/core_api/views.py` - Added OAuth endpoints
- `back_web/core_api/serializers.py` - Updated serializers
- `back_web/core_api/urls.py` - Added OAuth routes
- Database migration applied automatically

### Frontend
- `front_web/src/App.jsx` - Added protected routes, updated avatar display
- `front_web/src/components/auth/SocialLogin.jsx` - Backend integration
- `front_web/src/pages/auth/CustomerRegister.jsx` - Added social login
- `front_web/src/pages/auth/CustomerLogin.jsx` - Updated social login handler
- `front_web/.env.local` - Firebase config template (NEW)
- `front_web/FIREBASE_SETUP.md` - Setup guide (NEW)
