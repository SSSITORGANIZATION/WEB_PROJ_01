# Firebase Authentication Setup Guide

This guide will help you set up Firebase Authentication for Google and GitHub OAuth in your application.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" 
3. Enter a project name (e.g., "your-app-auth")
4. Accept the terms and click "Create project"
5. Wait for the project to be created

## Step 2: Enable Authentication

1. In your Firebase project dashboard, click "Authentication" in the left sidebar
2. Click "Get Started"
3. Click the "Sign-in method" tab
4. Enable **Google** sign-in:
   - Click on Google
   - Enable the toggle
   - Add your project's authorized domains (see below)
   - Click "Save"
5. Enable **GitHub** sign-in:
   - Click on GitHub
   - Enable the toggle
   - You'll need to set up GitHub OAuth (see Step 3)
   - Click "Save"

## Step 3: Set up GitHub OAuth (for GitHub sign-in)

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "OAuth Apps" → "New OAuth App"
3. Fill in the form:
   - **Application name**: Your app name
   - **Homepage URL**: `http://localhost:4002` (for development)
   - **Application description**: (optional)
   - **Authorization callback URL**: `https://auth.firebase.com/` OR use your Firebase project's callback URL
4. Click "Register application"
5. Copy the **Client ID** and generate a **Client Secret**
6. Go back to Firebase Console → Authentication → Sign-in method → GitHub
7. Paste the Client ID and Client Secret
8. Click "Save"

## Step 4: Get Firebase Configuration

1. In Firebase Console, click the gear icon (Project Settings)
2. Scroll down to "Your apps" section
3. Click the web icon (`</>`) to add a web app
4. Give it a name (e.g., "Frontend Web")
5. Register the app
6. Copy the `firebaseConfig` object

## Step 5: Update Environment Variables

Open `front_web/.env.local` and replace the placeholder values with your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your-actual-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

## Step 6: Authorized Domains

For local development, add these domains to your Firebase Authentication authorized domains:

- `http://localhost:4002`
- `http://127.0.0.1:4002`

For production, add your actual domain.

## Step 7: Restart Development Server

After updating the `.env.local` file, restart your frontend development server:

```bash
cd front_web
npm run dev
```

## How It Works

1. **User clicks "Continue with Google/GitHub"**
2. Firebase handles the OAuth popup
3. User authenticates with Google/GitHub
4. Firebase returns user data (email, name, avatar, etc.)
5. Frontend sends this data to your Django backend (`/auth/google/` or `/auth/github/`)
6. Backend creates or links the user account in the database
7. Backend returns a token and user data
8. Frontend stores the token and user data in localStorage
9. User is now authenticated and can access protected routes

## Backend Endpoints

The following endpoints have been created in your Django backend:

- `POST /auth/google/` - Handle Google OAuth authentication
- `POST /auth/github/` - Handle GitHub OAuth authentication

Both endpoints accept:
- `google_id` or `github_id` (required)
- `email` (required for Google, optional for GitHub)
- `name` (optional)
- `avatar_url` (optional)

## Testing

1. Start your Django backend: `cd back_web && python manage.py runserver`
2. Start your frontend: `cd front_web && npm run dev`
3. Navigate to `http://localhost:4002`
4. You should be redirected to the login page
5. Try signing up with email/password OR use Google/GitHub OAuth
6. After successful authentication, you'll be redirected to the home page

## Troubleshooting

**"Social sign-in is not configured" error:**
- Make sure you've filled in all Firebase credentials in `.env.local`
- Restart the frontend server after updating environment variables

**"Pop-up was blocked by browser" error:**
- Allow pop-ups for localhost in your browser settings

**"Invalid credentials" error:**
- Check that your Firebase project has the correct authorized domains
- Ensure the sign-in methods are enabled in Firebase Console

**Backend errors:**
- Make sure Django migrations are applied: `python manage.py migrate`
- Check that the backend server is running on port 8000
